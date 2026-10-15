# Coverage limits and accuracy roadmap

The application works, but the requested complete physical digital twin is not yet achieved. No source inspection supports a claim to every identifiable board component or to manufacturing-accurate geometry.

## Present limits

- No verified A2251 CAD. Exterior corner radii, thickness distribution, port apertures and hinge axes are estimates. The upper deck does not have physically cut keyboard/trackpad openings.
- Board outline, packages and traces are conceptual. CPU SKU, board revision, RAM/NAND package identities, storage/controller architecture, power ICs, Thunderbolt controllers, shields and PCB layers need model-specific evidence. Generic package regions must not be used as a location map for service.
- Six battery visual regions follow guide imagery; series/parallel topology and pouch dimensions are unknown. Guide photos may depict other models.
- Display optics, actual scissor mechanisms, trackpad actuator internals, individual microphone locations, antenna elements, detailed flex folds, temperature sensors and thermal-interface thickness are absent or only described.
- Fan blade count and winding, individual key spacing and lower-case screw placement are illustrative. There is no transistor-level reconstruction.
- Thermal/airflow models have no measured temperatures, flow rates or boundary conditions. Power and data modes omit unknown intermediary circuitry.
- Disassembly is a sourced summary, with simplified visibility transitions. Adhesive, clip/latch motions, full screw animation and all repair branches are not simulated.
- Target MacBook/iPhone performance, Safari touch behavior and physical dimensions have not been validated on hardware. Cloud software-rendering metrics cannot substitute for those measurements.
- Camera orbit gestures are not part of undo history; component and layer-state navigation is. Section-plane position is separately reset.

## Next work, in evidence order

1. Record the owner's CPU/RAM/SSD configuration and keyboard region without publishing a serial number. Confirm the physical model from the lower case.
2. Obtain authorized A2251-specific orthographic teardown photos and measurement references, documenting board revision. Cross-check every photographed part against that revision. Preserve source license metadata.
3. Replace exterior plate approximations with verified CAD or calibrated photo reconstruction; add real cutouts, hinge kinematics, screw/clip locations and a measurement tolerance budget.
4. Reconstruct battery shapes, board outline, fans, speakers, brackets and flex routing. Classify each replacement as Tier 1 or Tier 2 only when its evidence supports it.
5. Identify marked ICs from legible board photographs; attach manufacturer datasheets and verify relationships. Keep unidentified passives as numbered visual components, without invented values.
6. Add measured thermal/airflow datasets and sourced power/data topology. Label remaining unmeasured behavior explicitly.
7. Expand guide-backed removal branches and per-fastener steps. Add collision/clearance testing and compare registered camera views against the reference images.
8. Profile a 2020 Intel A2251 and modern iPhone/Safari; set real triangle, draw-call, memory and interaction-latency budgets. Validate accessibility with keyboard and assistive technology.
