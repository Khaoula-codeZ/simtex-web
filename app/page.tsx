"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/5 to-slate-900" />
        <div className="glow-orb absolute inset-x-10 top-0 h-64 rounded-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_60%)]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 lg:px-8">
        {/* NAVBAR (sticky) */}
        <header className="sticky top-2 z-30 mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/70 px-4 py-3 backdrop-blur">
          {/* LOGO */}
          <a href="/" className="flex items-center gap-3">
            <img 
              src="/simtex-logo.svg" 
              alt="SimTex Logo" 
              className="h-8 w-auto hover:opacity-90 transition-opacity"
            />
            <div className="leading-tight">
        
            </div>
          </a>




          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#how" className="hover:text-cyan-300 transition-colors">
              How it works
            </a>
            <a href="#engines" className="hover:text-cyan-300 transition-colors">
              Engines
            </a>
            <a href="#examples" className="hover:text-cyan-300 transition-colors">
              Examples
            </a>
            <a href="/playground" className="hover:text-cyan-300 transition-colors">
              Playground
            </a>
          </nav>

          <a
            href="#beta"
            className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-colors"
          >
            Join the beta
          </a>
        </header>

        {/* HERO */}
        <section className="mt-10 grid flex-1 items-center gap-10 md:mt-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Left: text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs text-cyan-300 ring-1 ring-cyan-400/40">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>PHITS · Geant4 · FLUKA</span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl lg:text-5xl">
              From text prompt to
              <span className="block text-cyan-300">
                Monte Carlo input decks
              </span>
              in seconds.
            </h1>

            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              SimTex converts controlled natural language into validated input
              files for PHITS, Geant4, and FLUKA. Describe your beam, geometry,
              and tallies—SimTex takes care of the syntax, cards, and boilerplate.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#beta"
                className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-colors"
              >
                Request early access
              </a>
              <a
                href="#examples"
                className="text-sm font-medium text-slate-200 hover:text-cyan-300 transition-colors"
              >
                View example prompts →
              </a>
              <a
                href="/playground"
                className="text-sm font-medium text-slate-200 hover:text-fuchsia-300 transition-colors"
              >
                Try playground →
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Created by Khaoula Younous</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                <span>BNCT, RT QA, and shielding ready</span>
              </div>
            </div>
          </div>

          {/* Right: floating console */}
          <div className="relative float-slow">
            <div className="absolute -inset-4 rounded-3xl bg-cyan-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-950/80 shadow-2xl shadow-cyan-500/20">
              {/* Window header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/70 px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[10px] text-slate-400">
                  simtex — prompt-to-input
                </span>
              </div>

              {/* Body: prompt + output */}
              <div className="grid gap-0 border-t border-slate-800/80 md:grid-cols-2">
                {/* Prompt */}
                <div className="border-b border-slate-800/80 md:border-b-0 md:border-r">
                  <div className="border-b border-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300">
                    Prompt
                  </div>
                  <pre className="h-52 overflow-auto bg-slate-950/80 px-3 py-3 text-[11px] leading-relaxed text-slate-200">
{`"Create a 30 MeV proton beam in PHITS for a head-and-neck BNCT case.
Field size 10x10 cm², water phantom 30x30x30 cm³ at 100 cm SSD.
Score depth-dose and 3D dose with t-track tallies."`}
                  </pre>
                </div>

                {/* Output */}
                <div>
                  <div className="border-b border-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-cyan-300">
                    Generated PHITS input (preview)
                  </div>
                  <pre className="h-52 overflow-auto bg-slate-950/80 px-3 py-3 text-[11px] leading-relaxed text-cyan-100">
{`/source
  proj = proton
  e0   = 30
  dist = 100.0

/surface
  1  px  -15.0
  2  px   15.0
  3  py  -15.0
  4  py   15.0
  5  pz    0.0
  6  pz   30.0

/cell
  1  1  -1 2 -3 4 -5 6

[t-track]
  file = dose3d.out
  unit = Gy
  volume = phantom
  part = all
`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className="mt-10 flex flex-col items-center gap-2 text-xs text-slate-500">
          <div className="scroll-indicator flex h-8 w-5 items-start justify-center rounded-full border border-slate-700/80">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-300" />
          </div>
          <span>Scroll to learn how SimTex works</span>
        </div>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="mt-16 rounded-3xl border border-slate-800/70 bg-slate-950/70 px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                How SimTex works
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                SimTex parses a structured natural-language description of your
                setup, maps it to an internal representation of geometry,
                sources, and scorers, and then compiles it into engine-specific
                input decks.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-300">
                1
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                Parse the prompt
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                The text is interpreted as a physics specification: particle
                type, beam energy, field size, phantom dimensions, materials,
                scoring regions, and tallies.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-500/20 text-xs font-semibold text-fuchsia-300">
                2
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                Build a simulation model
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                SimTex assembles an internal model of the geometry, materials,
                sources, and scorers, enforcing consistency checks on units,
                ranges, and typical therapy / shielding conventions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300">
                3
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                Compile to input decks
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                The internal model is rendered into PHITS, Geant4, or FLUKA
                syntax with sensible defaults, ready to run, edit, or version
                control in your existing workflows.
              </p>
            </div>
          </div>
        </section>

        {/* ENGINES */}
        <section id="engines" className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Engine support
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                SimTex is designed to sit on top of existing Monte Carlo
                engines, not replace them. The same prompt can target multiple
                engines while preserving physics intent.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* PHITS */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-cyan-300">
                PHITS
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Therapy, BNCT, shielding, and activation workflows with structured
                tallies such as <code className="text-[11px]">[t-track]</code> and{" "}
                <code className="text-[11px]">[t-deposit]</code>.
              </p>
              <pre className="mt-3 flex-1 overflow-auto rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-cyan-100">
{`/source  proj = neutron  e0 = 1.0e-3

[material]
  phantom = water

[t-track]
  file   = dose_depth.out
  region = phantom
  unit   = Gy`}
              </pre>
            </article>

            {/* GEANT4 */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-fuchsia-300">
                Geant4
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Macro and GDML generation for medical physics setups, including
                dose meshes and scoring volumes.
              </p>
              <pre className="mt-3 flex-1 overflow-auto rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-fuchsia-100">
{`/g4sim/beam/setParticle gamma
/g4sim/beam/setEnergy 6 MeV
/g4sim/phantom/setBox 30 30 30 cm
/g4sim/score/mesh/setDoseMesh 60 60 60
/run/beamOn 1e6`}
              </pre>
            </article>

            {/* FLUKA */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-300">
                FLUKA
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Support for shielding and therapy-like cases using standard
                cards, scoring bins, and region definitions.
              </p>
              <pre className="mt-3 flex-1 overflow-auto rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-emerald-100">
{`BEAM         150.0      PROTON
GEOBEGIN     COMBNAME
*  define phantom and shielding
GEOEND
USRBIN       10.0 DOSE -21.0   60.0 60.0 60.0
USRBIN       0.0  PHANTOM-DOSE
START        1.0E6`}
              </pre>
            </article>
          </div>
        </section>

        {/* EXAMPLES */}
        <section id="examples" className="mt-12 mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Example prompts → input decks
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                A single natural-language description can be compiled into
                PHITS, Geant4, or FLUKA templates, preserving the same physical
                intent across engines.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {/* Example 1 */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                BNCT · PHITS
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Prompt:
              </p>
              <pre className="mt-1 rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-slate-200">
{`"Epithermal neutron beam for head-and-neck BNCT,
water-equivalent phantom, score component doses
(boron, hydrogen, nitrogen, gamma) in a 3D mesh."`}
              </pre>
              <p className="mt-2 text-xs text-slate-400">Preview output:</p>
              <pre className="mt-1 flex-1 overflow-auto rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-cyan-100">
{`[t-track]
  file   = boron.out
  part   = boron
  volume = target

[t-track]
  file   = hydro.out
  part   = proton
  volume = target`}
              </pre>
            </article>

            {/* Example 2 */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                LINAC QA · Geant4
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Prompt:
              </p>
              <pre className="mt-1 rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-slate-200">
{`"6 MV photon beam, 10x10 cm² field, water tank
phantom with 1 mm dose mesh, compute PDD
and lateral profiles for QA."`}
              </pre>
              <p className="mt-2 text-xs text-slate-400">Preview output:</p>
              <pre className="mt-1 flex-1 overflow-auto rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-fuchsia-100">
{`/g4sim/phantom/setVoxelSize 0.1 0.1 0.1 cm
/g4sim/score/mesh/setDoseMesh 200 200 200
/run/beamOn 5e6`}
              </pre>
            </article>

            {/* Example 3 */}
            <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Shielding · FLUKA
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Prompt:
              </p>
              <pre className="mt-1 rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-slate-200">
{`"Concrete bunker wall, 150 MeV proton beam,
score ambient dose equivalent behind the shield
on a 2D map."`}
              </pre>
              <p className="mt-2 text-xs text-slate-400">Preview output:</p>
              <pre className="mt-1 flex-1 overflow-auto rounded-xl bg-slate-950/90 px-3 py-2 text-[11px] leading-relaxed text-emerald-100">
{`USRBIN   20.0 H-STAR -21.0   50.0 50.0 1.0
USRBIN   0.0  SHIELD-MAP
START    5.0E6`}
              </pre>
            </article>
          </div>
        </section>

        {/* BETA CTA + FOOTER */}
        <section
          id="beta"
          className="mb-8 mt-4 rounded-3xl border border-slate-800/80 bg-slate-950/80 px-5 py-6 sm:px-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-50 sm:text-base">
                Join the early access list
              </h3>
              <p className="mt-1 max-w-xl text-xs text-slate-300">
                Be notified when the first public SimTex beta is available.
                Ideal for BNCT groups, treatment-planning researchers, and
                medical physics students.
              </p>
            </div>
            <form
              className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="submit"
                className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/30 hover:bg-cyan-400 transition-colors"
              >
                Join beta
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-2 border-t border-slate-800/60 pt-4 text-xs text-slate-500">
          SimTex © {new Date().getFullYear()} — Prompt-driven Monte Carlo.
        </footer>
      </div>
    </main>
  );
}
