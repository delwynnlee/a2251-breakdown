# A2251 — Form / Function

A working React + TypeScript + React Three Fiber engineering explorer for the **2020 MacBook Pro 13-inch with four Thunderbolt 3 ports**. Research and geometry confidence remain visible throughout the interface.

**This is a research edition, not a completed mechanically accurate digital twin.** Apple specifications and selected iFixit procedures are verified. Exterior geometry approximates published dimensions; internal geometry, board placement, fan blades, key layout and package details remain illustrative. No proprietary CAD, board schematics or photographs are bundled.

## Run

Requires Node 22.18+ (validated with Node 24.19) and npm. No credentials, database or external runtime services are needed.

```sh
npm ci
npm run dev -- --port 5173
```

In this cloud sandbox, use `npm ci --cache /workspace/.npm-cache` for a writable package cache.

Open the development server in your own browser. The cloud onboarding UI does not provide a web preview. All fonts and application assets are local; the source links are optional external navigation.

```sh
npm run build
npm run preview -- --port 4173
npm test
npm run test:e2e
npm run inventory
```

Browser tests default to `/usr/bin/chromium`. Set `CHROMIUM_PATH` to an installed Chromium executable on other systems. Tests use software WebGL in the cloud; measured performance is not representative of a MacBook or iPhone GPU.

## Explore

- Drag to orbit, scroll/pinch to zoom, right-drag/two-finger interaction to pan.
- Open the lid, reveal internals with X-ray, separate layers with Explode, or move the cross-section plane.
- Select a scene mesh or tree entry; double-click to focus. Isolate, hide, restore, reset or undo view-state changes.
- Search by component name or function (⌘/Ctrl K). Follow breadcrumbs back through assemblies.
- Switch Beginner/Engineer explanations and open Evidence & geometry for sources and uncertainty.
- Thermal, Power and Data modes show clearly labeled simplified relationships.
- Disassembly follows cited lower-case → battery isolation → trackpad → battery-pack prerequisites. It is a summary, not complete physical repair instruction.
- Auto quality adapts rendering resolution; Low provides a fallback. FPS, draw calls and triangle count appear on desktop.

## Structure

- `src/manifest.ts`: canonical component hierarchy, positions, specifications, sources, confidence, educational modes and removal sequence.
- `src/state.ts`: selection, visibility, isolation and bounded undo state.
- `src/Scene.tsx`: camera, clipping, animation, material and performance instrumentation.
- `src/Keys.tsx`: instanced keycaps with individual selection.
- `src/InternalAssembly.tsx`: on-demand internal assembly mounting.
- `src/App.tsx`, `src/style.css`: responsive controls, searchable hierarchy and evidence panels.
- `src/state.test.ts`, `tests/explorer.spec.ts`: unit and browser validation.

Read [research and evidence](docs/research.md), [hardware inventory](docs/hardware-inventory.md), [component manifest](docs/component-manifest.json), [limitations and roadmap](docs/roadmap.md) and [validation report](docs/validation.md).

## Rights

Application geometry is procedurally authored. External source references are attributed and linked; their assets are not bundled. Apple and MacBook are trademarks of Apple Inc. This independent educational project is not affiliated with Apple or iFixit. Review source licenses before adding any future third-party CAD or photographs.

To collect repeatable cloud renderer samples, keep the development server running and run `node scripts/benchmark.mjs`. It writes `docs/performance.json`. Run benchmarks separately from builds and browser suites to avoid CPU contention. The Low preset renders at 0.75 device-pixel ratio; Auto lowers quality after two consecutive slow samples.
