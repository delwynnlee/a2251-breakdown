# Validation report

Validated 14 October 2026 in the cloud environment. This establishes an executable development workflow, not a complete or mechanically validated digital twin.

| Check                            | Outcome                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen dependency reinstall      | `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` passed using Node 24.19 and npm 11.9                                                                    |
| Type checking / production build | `npm run build` passed                                                                                                                                              |
| Unit tests                       | 9 passed, 0 failed, 0 skipped                                                                                                                                       |
| Browser suite                    | 3 passed, 0 failed, 0 skipped; Chromium with software WebGL                                                                                                         |
| Production smoke                 | Built application served on port 4173; actual WebGL canvas rendered, lazy internals loaded, processor selection and thermal notes worked; no JavaScript page errors |
| Inventory export                 | 172 unique, connected entries generated; JSON download exercised                                                                                                    |
| Responsive layout                | 1440×960 desktop and 390×844 mobile viewport; no horizontal page overflow                                                                                           |
| Current development server       | HTTP document and browser interaction verified on port 5173                                                                                                         |

## What the browser tests exercise

Camera orbit and wheel zoom are verified by changes in the rendered camera position, including persistence across periodic metrics updates. X-ray checks inspect the actual scene material transparency. The suite opens the lid, adjusts X-ray, selects the logic board, isolates/restores it, changes explosion and section controls, searches for the processor, switches explanations and evidence, changes all learning modes, advances the sourced disassembly sequence, resets the scene, and picks the display enclosure directly on the canvas. Separate scenarios inspect individual instanced keys and fan blades, undo isolation and download the manifest. Mobile navigation opens the component drawer, searches/selects a fan, operates layer controls and checks the information panel.

Screenshots are written under `test-results/` (ignored generated output): `desktop-closed.png`, `desktop-thermal.png`, `mobile.png`, and `production.png`. They were visually inspected. Initial issues with separated exterior plates, mobile framing, stale opaque shaders and camera resets were corrected. Capture waits allow animated transitions to settle.

No exhaustive mesh-intersection or geometric-registration test exists. Cross sections are uncapped clipping surfaces. Approximate assembly placements and their intersections cannot establish mechanical validity. Target-device touch/Safari behavior is untested.

## Measured rendering performance

See [raw measurements](performance.json). Benchmark ran separately from the build and browser suite, at 1440×960 in Low quality (0.75 device-pixel ratio), using ANGLE / Vulkan **SwiftShader software rendering**.

| View             | Observed FPS range | Draw calls | Triangles |
| ---------------- | -----------------: | ---------: | --------: |
| Closed exterior | 15–18 | 35 | 11.8k |
| Open X-ray | 10–11 | 74 | 23.6k |
| Exploded thermal | 10–13 | 84 | 23.7k |

This is not smooth target-hardware performance, and no claim of smoothness on a 2020 Intel MacBook or iPhone is made. FPS is a sampled frame rate, not a percentile latency benchmark. Use `node scripts/benchmark.mjs` with the dev server running to repeat the samples; run it independently of builds and other browser sessions.

Implemented controls include instanced keycaps/blades/passives, fan mesh distance LOD, deferred 3D bundle and internal assembly mounting, reduced geometry in Low quality, adaptive resolution after consecutive slow samples, and single-pass transparent materials. At this scale a separate spatial index was not introduced; Three.js mesh/instance raycasting is used. No external textures need downloading. React Three Fiber releases declarative GPU resources on unmount; custom plate geometry is explicitly disposed. Continuous rendering remains an energy/performance optimization opportunity.

## Remaining build warning

The deferred Three.js/R3F scene chunk is about 968 kB minified / 261 kB gzip. Vite reports its standard chunk-size warning. It is deferred from the initial interface; further vendor partitioning is not evidence of lower total download or runtime cost.

## Reusable cloud configuration

Saved and confirmed: `install_script`, `start_skill`, and research egress domains (`support.apple.com`, `www.ifixit.com`, `ifixit.com`, `guide-images.cdn.ifixit.com`). Installation and startup commands were exercised. No secrets or application services are required.

Saving the configuration is not publication. Review/save the environment settings and publish the environment through the product. A restored fresh task has not been independently validated. Runtime processes must be restarted using the saved instructions.
