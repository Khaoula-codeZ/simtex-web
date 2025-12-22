"use client";

import { useEffect, useState } from "react";

type Engine = "phits" | "geant4" | "fluka";
type Axis = "z" | "y" | "x";

const DEFAULT_PROMPT = `30 MeV proton beam on a 30x30x30 cm³ water phantom.
Field size 10x10 cm², distance 100 cm.
Score voxelized dose in the phantom volume.`;

export default function PlaygroundPage() {
  const [engine, setEngine] = useState<Engine>("phits");
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);

  // UI polish controls (Geant4 only)
  const [sliceZ, setSliceZ] = useState(25);
  const [sliceAxis, setSliceAxis] = useState<Axis>("z");
  const [autoscale, setAutoscale] = useState(true);

  // API output
  const [result, setResult] = useState<any>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [phitsPngUrl, setPhitsPngUrl] = useState<string | null>(null);
  const [phitsPreview, setPhitsPreview] = useState<any>(null);
  const [phitsPreviewLoading, setPhitsPreviewLoading] = useState(false);



  // Email gate
  const [email, setEmail] = useState("");
  const [emailOk, setEmailOk] = useState(false);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  // Pretty text panel
  const [output, setOutput] = useState<string>(
    "Click “Generate input” to call SimTex.\n\nPHITS/FLUKA should return text decks.\nGeant4 returns paths + PNG preview."
  );

  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-load saved email (unlock persists across refresh)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("simtex_email");
      if (saved && saved.includes("@")) {
        setEmail(saved);
        setEmailOk(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const submitEmail = async () => {
    setEmailMsg(null);
    const clean = email.trim().toLowerCase();

    if (!clean || !clean.includes("@")) {
      setEmailMsg("Enter a valid email.");
      return;
    }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean, source: "playground", engine }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setEmailMsg(j?.error || "Email submit failed.");
        return;
      }

      setEmailOk(true);
      setEmailMsg(null);

      // remember locally so they don’t re-enter every refresh
      localStorage.setItem("simtex_email", clean);
    } catch {
      setEmailMsg("Network error submitting email.");
    }
  };
  const refreshPreview = async (next?: Partial<{ slice_z: number; slice_axis: Axis; autoscale: boolean }>) => {
  if (engine !== "geant4") return;
  try {
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slice_z: next?.slice_z ?? sliceZ,
        slice_axis: next?.slice_axis ?? sliceAxis,
        autoscale: next?.autoscale ?? autoscale,
      }),
    });
    const data = await res.json();
    if (!res.ok) return;

    // backend returns { png: "/abs/path/....png", stats?: ... }
    if (data?.png) setPngUrl(`/api/file?path=${encodeURIComponent(data.png)}&t=${Date.now()}`);
    if (data?.stats) setResult((prev: any) => ({ ...(prev || {}), stats: data.stats }));
  } catch {
    // ignore preview errors
  }
};
  useEffect(() => {
    if (engine !== "geant4") return;
    // don’t call preview until we already have a run result (pngUrl set once)
    if (!pngUrl) return;
    refreshPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, sliceZ, sliceAxis, autoscale]);

  const downloadText = (name: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};
const refreshPhitsPreview = async (path?: string) => {
  if (engine !== "phits") return;
  setPhitsPreviewLoading(true);
  try {
    const res = await fetch("/api/phits_preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(path ? { path } : {}),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data) return;

    setPhitsPreview(data);
    if (data?.png) {
      setPhitsPngUrl(`/api/file?path=${encodeURIComponent(data.png)}`);
    }
  } finally {
    setPhitsPreviewLoading(false);
  }
};



  const handleGenerate = async () => {
  setIsGenerating(true);
  setResult(null);
  setPngUrl(null);

  try {
    const payload: any = { engine, prompt };

    if (engine === "geant4") {
      payload.slice_z = sliceZ;
      payload.slice_axis = sliceAxis;
      payload.autoscale = autoscale;
    }

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      const msg = errBody?.error || `Request failed with status ${res.status}`;
      setOutput(`// Error from SimTex API:\n// ${msg}`);
      return;
    }

    const data = await res.json();
    setResult(data);

    // normalize backend shape:
    // PHITS/FLUKA => { output: "..." }
    // Geant4 => { case_dir, png, stats, ... }
    const normalized =
      data && typeof data === "object" && "output" in data ? (data as any).output : data;

    if (typeof normalized === "string") {
      setOutput(normalized);
    } else {
      setOutput(JSON.stringify(normalized, null, 2));
    }

    if (data?.png) {
      setPngUrl(`/api/file?path=${encodeURIComponent(data.png)}`);
    }
  } catch (error: any) {
    console.error(error);
    setOutput(
      "// Network error while calling SimTex API.\n// Check the dev server and try again."
    );
  } finally {
    setIsGenerating(false);
  }
};



  const stats = result?.stats;
  const normalized =
    result && typeof result === "object" && "output" in result ? (result as any).output : result;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/8 to-slate-900" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 lg:px-8">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400/80 hover:text-cyan-200 transition-colors"
          >
            ← Back to landing
          </a>
          <div className="text-xs text-slate-400">Playground · connected to backend</div>
        </header>

        <section className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
    {/* Left */}
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
          SimTex Playground
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Type a controlled natural-language description of your Monte Carlo setup,
          choose the engine, and generate an executable artifact.
        </p>
      </div>

      {/* Email gate */}
      {!emailOk && (
        <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5">
          <div className="text-sm font-semibold text-slate-100">Early access gate</div>
          <div className="mt-1 text-xs text-slate-400">
            Enter your email to unlock the Playground (so we can track usage & improve SimTex).
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full sm:max-w-sm rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <button
              type="button"
              onClick={submitEmail}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Unlock
            </button>
          </div>

          {emailMsg && <div className="mt-2 text-xs text-rose-300">{emailMsg}</div>}
        </div>
      )}

      {/* Engine selector */}
      <div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Engine
        </div>
        <div className="inline-flex overflow-hidden rounded-full border border-slate-700/80 bg-slate-900/70 text-xs">
          {(["phits", "geant4", "fluka"] as Engine[]).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEngine(e)}
              className={`px-4 py-1.5 capitalize transition-colors ${
                engine === e
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800/90"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Geant4 controls */}
      {engine === "geant4" && (
        <div className="mt-2 rounded-2xl border border-slate-700/60 bg-slate-950/50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-3">
            Geant4 dose preview
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="opacity-70">Plane</span>
              <button
                onClick={() => {
                  setSliceAxis("z");
                  refreshPreview({ slice_axis: "z" });
                }}
                className={`px-3 py-1 rounded ${
                  sliceAxis === "z" ? "bg-cyan-500/20" : "bg-white/5"
                }`}
                type="button"
              >
                Axial (z)
              </button>
              <button
                onClick={() => {
                  setSliceAxis("y");
                  refreshPreview({ slice_axis: "y" });
                }}
                className={`px-3 py-1 rounded ${
                  sliceAxis === "y" ? "bg-cyan-500/20" : "bg-white/5"
                }`}
                type="button"
              >
                Coronal (y)
              </button>
              <button
                onClick={() => {
                  setSliceAxis("x");
                  refreshPreview({ slice_axis: "x" });
                }}
                className={`px-3 py-1 rounded ${
                  sliceAxis === "x" ? "bg-cyan-500/20" : "bg-white/5"
                }`}
                type="button"
              >
                Sagittal (x)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-70">Slice</span>
              <input
                type="range"
                min={0}
                max={49}
                value={sliceZ}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setSliceZ(v);
                  refreshPreview({ slice_z: v });
                }}
              />
              <span className="tabular-nums w-10 text-right">{sliceZ}</span>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoscale}
                onChange={(e) => {
                  const v = e.target.checked;
                  setAutoscale(v);
                  refreshPreview({ autoscale: v });
                }}
              />
              <span>Autoscale</span>
            </label>
          </div>

          <div className="mt-2 text-xs text-slate-400">{stats?.units ?? "a.u."}</div>
        </div>
      )}

      {/* Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Prompt</span>
          <button
            type="button"
            className="text-[11px] text-cyan-300 hover:text-cyan-200"
            onClick={() => setPrompt(DEFAULT_PROMPT)}
          >
            Reset example
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[150px] w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-3 py-3 text-sm text-slate-100 shadow-sm shadow-slate-900/60 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          placeholder="Describe your beam, phantom, tallies..."
        />
      </div>

      {/* Generate */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !emailOk}
          className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-600/50"
        >
          {isGenerating ? (
            <>
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              Generating…
            </>
          ) : (
            "Generate input"
          )}
        </button>
        <p className="text-xs text-slate-400">
          {!emailOk
            ? "Locked until email is submitted."
            : "PHITS/FLUKA → deck text. Geant4 → files + PNG."}
        </p>
      </div>

      {/* PHITS preview button (must stay INSIDE left column) */}
      {engine === "phits" && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshPhitsPreview()}
            className="rounded-full border border-slate-700/70 bg-slate-900/70 px-4 py-2 text-xs text-slate-200 hover:border-cyan-400/80 hover:text-cyan-200 transition-colors disabled:opacity-50"
            disabled={phitsPreviewLoading}
          >
            {phitsPreviewLoading ? "Rendering preview..." : "Preview RBEdose"}
          </button>

          {phitsPngUrl && (
            <a
              href={phitsPngUrl}
              download
              className="rounded-full border border-slate-700/70 bg-slate-900/70 px-4 py-2 text-xs text-slate-200 hover:border-cyan-400/80 hover:text-cyan-200 transition-colors"
            >
              Download PNG
            </a>
          )}
        </div>
      )}
    </div>

    {/* Right: output */}
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-cyan-500/10 blur-2xl" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950/85 shadow-2xl shadow-cyan-500/20">
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-[10px] text-slate-400">
            {engine.toUpperCase()} · output
          </span>
        </div>

        <pre className="flex-1 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words bg-slate-950/90 px-4 py-3 text-[12px] leading-relaxed text-slate-200">
          {output}
        </pre>

        {/* Actions under output */}
        <div className="border-t border-slate-800/80 bg-slate-950/70 px-4 py-3 flex flex-wrap gap-2">
          {/* PHITS / FLUKA text download */}
          {typeof normalized === "string" && engine !== "geant4" && (
            <button
              type="button"
              onClick={() => downloadText(`${engine}.inp`, normalized)}
              className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-1.5 text-xs text-slate-200 hover:border-cyan-400/80 hover:text-cyan-200"
            >
              Download {engine.toUpperCase()} text
            </button>
          )}

          {/* Geant4 downloads */}
          {engine === "geant4" && result?.png && (
            <a
              href={`/api/file?path=${encodeURIComponent(result.png)}`}
              download
              className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-1.5 text-xs text-slate-200 hover:border-cyan-400/80 hover:text-cyan-200"
            >
              Download PNG
            </a>
          )}

          {engine === "geant4" && typeof output === "string" && output.length > 0 && (
            <button
              type="button"
              onClick={() => downloadText(`geant4_output.json`, output)}
              className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-1.5 text-xs text-slate-200 hover:border-cyan-400/80 hover:text-cyan-200"
            >
              Download JSON
            </button>
          )}
        </div>

        {/* PHITS preview image goes HERE (not inside actions bar) */}
        {engine === "phits" && phitsPngUrl && (
          <div className="border-t border-slate-800/80 bg-slate-950/70 px-4 py-4">
            <div className="text-xs text-slate-400 mb-2">PHITS RBEdose preview</div>
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-black/40">
              <img src={phitsPngUrl} alt="PHITS RBEdose preview" className="w-full h-auto" />
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="border-t border-slate-800/80 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div>
                <div className="text-[11px] opacity-70">Max</div>
                <div className="tabular-nums">{stats.max}</div>
              </div>
              <div>
                <div className="text-[11px] opacity-70">Mean</div>
                <div className="tabular-nums">{stats.mean}</div>
              </div>
              <div>
                <div className="text-[11px] opacity-70">Grid</div>
                <div className="tabular-nums">{(stats.grid || []).join("×")}</div>
              </div>
              <div>
                <div className="text-[11px] opacity-70">Voxel</div>
                <div className="tabular-nums">{stats.voxel_mm} mm</div>
              </div>
              <div>
                <div className="text-[11px] opacity-70">Primaries</div>
                <div className="tabular-nums">{stats.events}</div>
              </div>
              <div>
                <div className="text-[11px] opacity-70">Units</div>
                <div className="tabular-nums">{stats.units ?? "a.u."}</div>
              </div>
            </div>
          </div>
        )}

        {/* Geant4 PNG preview */}
        {pngUrl && (
          <div className="border-t border-slate-800/80 bg-slate-950/70 px-4 py-3">
            <div className="text-xs opacity-70 mb-2">Geant4 dose slice preview</div>
            <img
              src={pngUrl}
              alt="dose slice"
              className="w-full rounded-xl border border-white/10 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  </section>

  <footer className="mt-10 border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
    <p>
      Found a bug, error, or have a suggestion?
      <br />
      Contact us at{" "}
      <a
        href="mailto:simtex.mc.contact@gmail.com"
        className="text-cyan-400 hover:text-cyan-300 underline"
      >
        simtex.mc.contact@gmail.com
      </a>
    </p>
  </footer>
  </div> 
  </main> ); }

