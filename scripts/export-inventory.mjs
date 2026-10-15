import { parts, sources } from "../src/manifest.ts";
import { writeFileSync } from "node:fs";
const manifest = {
  model: "MacBook Pro 13-inch (2020), four Thunderbolt 3 ports",
  identifier: "A2251 / EMC 3348",
  reviewed: "2026-10-14",
  units: "cm",
  orientation:
    "+X right, +Y above keyboard, -Z toward hinge; these are scene coordinates, not measured placements",
  accuracyPolicy:
    "Fact confidence is independent of geometry accuracy. Tier 2 covers an exterior dimension-based approximation, not exact CAD. Tier 3 represents illustrative internals. No model-specific CAD obtained.",
  sources,
  components: parts,
};
writeFileSync(
  "docs/component-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
const cell = (s) => String(s).replaceAll("|", "\\|").replaceAll("\n", " ");
const rows = parts.map((p) =>
  [
    p.parent ?? "—",
    p.name,
    p.category,
    p.location,
    p.function,
    p.specs,
    `[${p.source}](${sources[p.source].url})`,
    p.geometry,
    p.confidence,
    p.missing || "Shape, placement and dimensions are not measured.",
  ]
    .map(cell)
    .join(" | "),
);
writeFileSync(
  "docs/hardware-inventory.md",
  "# A2251 hardware inventory\n\nGenerated from `src/manifest.ts` via `npm run inventory`. Facts reviewed 14 October 2026. All positions are scene estimates; source confidence does not validate geometry. Entries called proxy or region are not asserted chip identities. The device configuration owned by the user is unknown.\n\n| Assembly ID | Component | Category | Location / orientation | Function | Specifications | Source | Geometry availability | Fact confidence | Gaps |\n|---|---|---|---|---|---|---|---|---|---|\n" +
    rows.map((r) => "| " + r + " |").join("\n") +
    "\n",
);
console.log(`Exported ${parts.length} inventory entries.`);
