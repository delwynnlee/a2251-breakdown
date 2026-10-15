import { describe, it, expect } from "vitest";
import {
  parts,
  byId,
  ancestors,
  descendants,
  overlays,
  disassembly,
} from "./manifest";
import { initial, reducer, visible } from "./state";
describe("hardware manifest integrity", () => {
  it("has unique IDs, valid parents and no cycles", () => {
    expect(new Set(parts.map((p) => p.id)).size).toBe(parts.length);
    for (const p of parts) {
      if (p.parent) expect(byId[p.parent]).toBeDefined();
      expect(ancestors(p.id).length).toBeLessThan(8);
      expect(ancestors(p.id)[0].id).toBe("machine");
    }
  });
  it("labels every geometry and has traceable uncertainty", () => {
    for (const p of parts) {
      expect(p.geometry).toMatch(/^Tier [23]/);
      expect(p.source).toMatch(/apple|ifixit|lower|battery|trackpad|antenna/);
      expect(p.function.length).toBeGreaterThan(10);
      expect(p.confidence).toBeTruthy();
    }
  });
  it("has four user-confirmed Thunderbolt ports and individual keys", () => {
    expect(parts.filter((p) => p.id.startsWith("port-"))).toHaveLength(4);
    expect(descendants("keyboard").length).toBeGreaterThan(60);
  });
  it("has valid overlay endpoints and explicit model limitations", () => {
    for (const [mode, overlay] of Object.entries(overlays)) {
      overlay.paths.flat().forEach((id) => expect(byId[id]).toBeDefined());
      if (mode !== "Explore")
        expect(overlay.label).toMatch(/unverified|Simplified|Source-backed/);
    }
    disassembly.forEach((step) => expect(byId[step.id]).toBeDefined());
  });
});
describe("selection and visibility", () => {
  it("selects known nodes and rejects unknown ones", () => {
    expect(reducer(initial, { type: "select", id: "cpu" }).selected).toBe(
      "cpu",
    );
    expect(reducer(initial, { type: "select", id: "bogus" })).toBe(initial);
  });
  it("hides descendants while keeping siblings", () => {
    const s = reducer(initial, { type: "hide", id: "logic" });
    expect(visible("cpu", s)).toBe(false);
    expect(visible("fan-left", s)).toBe(true);
  });
  it("isolates assemblies with their descendants and toggles isolation", () => {
    let s = reducer(initial, { type: "isolate", id: "logic" });
    expect(visible("cpu", s)).toBe(true);
    expect(visible("lower", s)).toBe(false);
    s = reducer(s, { type: "isolate", id: "logic" });
    expect(visible("lower", s)).toBe(true);
  });
  it("restores visibility and undoes a complete view change", () => {
    const s = reducer(reducer(initial, { type: "hide", id: "power" }), {
      type: "set",
      patch: { lid: 105, mode: "Thermal" },
    });
    const undo = reducer(s, { type: "undo" });
    expect(undo.lid).toBe(0);
    expect(undo.hidden).toEqual(["power"]);
    expect(reducer(undo, { type: "restore" }).hidden).toEqual([]);
  });
  it("limits navigation history and resets controls", () => {
    let s = initial;
    for (let i = 0; i < 70; i++)
      s = reducer(s, { type: "set", patch: { explode: i / 100 } });
    expect(s.history).toHaveLength(40);
    expect(reducer(s, { type: "reset" })).toEqual(initial);
  });
});
