export type Vec3 = [number, number, number];
export type Part = {
  id: string;
  parent: string | null;
  name: string;
  category: string;
  position: Vec3;
  size: Vec3;
  color: string;
  shape?: "fan" | "cell" | "board" | "key" | "port" | "blade";
  function: string;
  engineer: string;
  specs: string;
  confidence:
    | "verified"
    | "user-confirmed"
    | "reference-pending"
    | "illustrative";
  geometry: "Tier 3 · illustrative" | "Tier 2 · dimension-based approximation";
  source: string;
  location: string;
  missing?: string;
  repair: string;
};
export const sources = {
  apple: {
    name: "Apple · exact four-port technical specifications",
    url: "https://support.apple.com/en-us/111339",
  },
  lower: {
    name: "iFixit · lower-case replacement, steps 1–7",
    url: "https://www.ifixit.com/Guide/a/143615",
  },
  battery: {
    name: "iFixit · battery replacement, steps 8–44",
    url: "https://www.ifixit.com/Guide/a/143618",
  },
  trackpad: {
    name: "iFixit · trackpad replacement, steps 15–22",
    url: "https://www.ifixit.com/Guide/a/143617",
  },
  antenna: {
    name: "iFixit · antenna assembly, steps 15–25",
    url: "https://www.ifixit.com/Guide/a/143616",
  },
  ifixit: {
    name: "iFixit · A2251 / EMC 3348 identification",
    url: "https://www.ifixit.com/Device/MacBook_Pro_13%22_Four_Thunderbolt_Ports_2020",
  },
};
const make = (
  id: string,
  parent: string | null,
  name: string,
  category: string,
  position: Vec3,
  size: Vec3,
  color: string,
  fn: string,
  extra: Partial<Part> = {},
): Part => ({
  id,
  parent,
  name,
  category,
  position,
  size,
  color,
  function: fn,
  engineer: fn,
  specs: "Exact dimensions and part identity pending source inspection.",
  confidence: "reference-pending",
  geometry: "Tier 3 · illustrative",
  source: "ifixit",
  location: `Conceptual position ${position.join(", ")}; +X right, +Y up, −Z rear, viewed from keyboard side.`,
  repair:
    "Consult the exact A2251 service guide. This model is not a repair procedure.",
  ...extra,
});
export const parts: Part[] = [
  make(
    "machine",
    null,
    "MacBook Pro A2251",
    "System",
    [0, 0, 0],
    [30.41, 1.56, 21.24],
    "#b6b8bc",
    "A 13-inch Intel MacBook Pro with four Thunderbolt 3 ports, identified by the owner.",
    {
      confidence: "user-confirmed",
      source: "apple",
      specs:
        "2020 · A2251 · Intel · four Thunderbolt 3 ports. Working envelope: 30.41 × 21.24 × 1.56 cm; dimensions awaiting source verification.",
      missing:
        "Serial-specific processor, RAM and SSD configuration is unknown.",
    },
  ),
  make(
    "enclosure",
    "machine",
    "Enclosure & display",
    "Assembly",
    [0, 0, 0],
    [30.4, 1.56, 21.2],
    "#a8acb3",
    "The metal enclosure supports and protects the assemblies.",
  ),
  make(
    "lower",
    "enclosure",
    "Lower case",
    "Mechanical",
    [0, -0.62, 0],
    [30.4, 0.2, 21.2],
    "#adb0b6",
    "A removable aluminium cover protects the underside.",
  ),
  make(
    "upper",
    "enclosure",
    "Upper case",
    "Mechanical",
    [0, 0.38, 0],
    [30.4, 0.25, 21.2],
    "#b7bbc1",
    "The palm rest and keyboard deck support the input devices.",
  ),
  make(
    "lid",
    "enclosure",
    "Display enclosure",
    "Display",
    [0, 0.9, 0],
    [30.4, 0.35, 21.2],
    "#a9adb5",
    "The lid supports the display and its associated wiring.",
    { specs: "13-inch class; panel and lid stack thickness unverified." },
  ),
  make(
    "panel",
    "lid",
    "Retina display panel",
    "Display",
    [0, 0.78, 0],
    [28.4, 0.06, 18.5],
    "#111820",
    "Turns electrical image data into visible light.",
    {
      source: "apple",
      specs:
        "Working reference: 13.3-inch, 2560 × 1600. Awaiting live source verification.",
      engineer:
        "A display combines a pixel matrix, optical films, backlight and drive electronics. Their exact A2251 stack is not reconstructed.",
    },
  ),
  make(
    "camera",
    "lid",
    "Camera assembly",
    "Sensor",
    [0, 0.74, 9.65],
    [0.45, 0.07, 0.22],
    "#182833",
    "Captures images above the display.",
    { missing: "Sensor identity and display flex routing unknown." },
  ),
  make(
    "hinge-left",
    "enclosure",
    "Left hinge",
    "Mechanical",
    [-10, 0.2, -9.6],
    [3, 0.5, 0.75],
    "#737880",
    "Maintains the display angle.",
  ),
  make(
    "hinge-right",
    "enclosure",
    "Right hinge",
    "Mechanical",
    [10, 0.2, -9.6],
    [3, 0.5, 0.75],
    "#737880",
    "Maintains the display angle.",
  ),
  make(
    "inputs",
    "machine",
    "Keyboard & trackpad",
    "Assembly",
    [0, 0.5, 0],
    [24, 0.2, 18],
    "#34373c",
    "Input assemblies translate touch and keystrokes into signals.",
  ),
  make(
    "keyboard",
    "inputs",
    "Magic Keyboard",
    "Input",
    [0, 0.57, -2.4],
    [23, 0.15, 8.4],
    "#202226",
    "Individual keys provide tactile input.",
    {
      source: "apple",
      specs: "Scissor mechanism reference; regional key layout unverified.",
      missing:
        "Key mechanisms are represented conceptually, not a measured reconstruction.",
    },
  ),
  make(
    "key-mechanism",
    "keyboard",
    "Scissor mechanism proxy",
    "Mechanical",
    [0, 0.6, -2.4],
    [0.9, 0.1, 0.9],
    "#72767b",
    "A crossing linkage guides a keycap during travel.",
    {
      confidence: "illustrative",
      missing: "No model-specific mechanism geometry or travel measurements.",
    },
  ),
  make(
    "touchbar",
    "inputs",
    "Touch Bar",
    "Input",
    [0, 0.58, -7.25],
    [21, 0.08, 0.65],
    "#12161b",
    "A touch-sensitive display provides contextual controls.",
  ),
  make(
    "touchid",
    "inputs",
    "Touch ID / power button",
    "Input",
    [11.3, 0.58, -7.25],
    [0.9, 0.08, 0.7],
    "#181b20",
    "Provides power-button input and fingerprint authentication.",
    {
      missing:
        "Sensor package and exact secure data connections not identified.",
    },
  ),
  make(
    "trackpad",
    "inputs",
    "Force Touch trackpad",
    "Input",
    [0, 0.58, 6],
    [12.8, 0.1, 6.9],
    "#a3a8af",
    "Detects pointing gestures and presents tactile feedback.",
    {
      source: "apple",
      engineer:
        "Capacitive sensing tracks contact. Force sensing and a haptic actuator support click feedback; the mechanism is not geometrically reconstructed.",
    },
  ),
  make(
    "cooling",
    "machine",
    "Thermal system",
    "Assembly",
    [0, 0, -5],
    [25, 0.8, 7],
    "#363d43",
    "Transfers processor heat to the environment.",
  ),
  make(
    "fan-left",
    "cooling",
    "Left fan",
    "Cooling",
    [-10.4, -0.03, -5.9],
    [4.7, 0.65, 4.7],
    "#373f46",
    "Moves air across the cooling assembly.",
    {
      shape: "fan",
      missing:
        "Two fans appear in guide photos, which may include another model. Blade count, handedness, RPM and duct geometry unverified.",
    },
  ),
  make(
    "fan-right",
    "cooling",
    "Right fan",
    "Cooling",
    [10.4, -0.03, -5.9],
    [4.7, 0.65, 4.7],
    "#373f46",
    "Moves air across the cooling assembly.",
    {
      shape: "fan",
      missing:
        "Two fans are visible in the A2251 guide imagery; some guide photos may depict other models. Exact geometry remains illustrative.",
    },
  ),
  make(
    "heatpipe",
    "cooling",
    "Heat-transfer assembly",
    "Cooling",
    [0, 0.21, -7.4],
    [17, 0.22, 0.9],
    "#343a3b",
    "Transfers heat toward the finned cooling regions.",
    {
      engineer:
        "A heat pipe transfers energy through evaporation and condensation of a working fluid. This bar is a conceptual path, not actual pipe routing.",
      missing:
        "Exact heat pipe shape, fins, material and contact plates unknown.",
    },
  ),
  make(
    "tim",
    "cooling",
    "Thermal interface proxy",
    "Cooling",
    [0, 0.12, -5.7],
    [2.6, 0.04, 2.2],
    "#8a8d8a",
    "Reduces contact resistance between a processor package and thermal assembly.",
    { confidence: "illustrative" },
  ),
  make(
    "logic",
    "machine",
    "Logic board",
    "Assembly",
    [0, -0.17, -5.5],
    [19, 0.18, 7],
    "#252e30",
    "Connects processing, memory, storage and peripheral circuits.",
    {
      shape: "board",
      missing:
        "Board outline, revision, layer stack and all package placements are illustrative.",
    },
  ),
  make(
    "cpu",
    "logic",
    "Intel processor / integrated GPU",
    "Semiconductor",
    [0, 0.04, -5.7],
    [2.6, 0.25, 2.2],
    "#b2b7be",
    "Runs instructions and produces graphics.",
    {
      source: "apple",
      confidence: "user-confirmed",
      specs:
        "Intel processor; exact SKU unknown. Integrated GPU shown within the processor package.",
      engineer:
        "The CPU executes general-purpose instructions. An integrated GPU shares the system memory architecture. Package contacts and internal silicon layout are not modeled.",
    },
  ),
  make(
    "memory",
    "logic",
    "Memory package group",
    "Semiconductor",
    [-4.2, 0.01, -5.3],
    [3.3, 0.25, 2.7],
    "#20262b",
    "Stores the working data used by the processor.",
    {
      specs:
        "Capacity and package identities unknown; depicted group is illustrative.",
      engineer:
        "Volatile memory holds active code and data. Placement, bus routing and individual package count have not been verified.",
    },
  ),
  make(
    "storage",
    "logic",
    "Flash storage package group",
    "Semiconductor",
    [4.3, 0.01, -5.3],
    [3.4, 0.25, 2.7],
    "#22282c",
    "Retains files when the machine is powered off.",
    {
      engineer:
        "NAND flash stores charge to encode data. Controller identity, package count and capacity require board-specific evidence.",
    },
  ),
  make(
    "power-ic",
    "logic",
    "Power-management region",
    "Electronics",
    [-5, 0.01, -8],
    [2.4, 0.22, 0.9],
    "#313638",
    "Converts and sequences supply rails.",
    {
      confidence: "illustrative",
      missing: "IC identities and electrical topology unknown.",
    },
  ),
  make(
    "thunderbolt",
    "logic",
    "Thunderbolt controller region",
    "Electronics",
    [5, 0.01, -8],
    [2.4, 0.22, 0.9],
    "#313638",
    "Connects external high-speed peripherals.",
    {
      confidence: "illustrative",
      missing: "Controller identities, counts and placement unknown.",
    },
  ),
  make(
    "wireless",
    "logic",
    "Wireless subsystem proxy",
    "Electronics",
    [7, 0.01, -3.2],
    [1.6, 0.22, 1],
    "#9b9f9d",
    "Provides wireless communication.",
    {
      confidence: "illustrative",
      missing: "Radio package, antenna feed routing and location unknown.",
    },
  ),
  make(
    "passives",
    "logic",
    "Passive components proxy",
    "Electronics",
    [-7, 0.01, -3.2],
    [1.8, 0.2, 1],
    "#826e4a",
    "Capacitors and inductors help filter, store and regulate electrical energy.",
    {
      confidence: "illustrative",
      missing:
        "No claim to an exhaustive board population or component values.",
    },
  ),
  make(
    "power",
    "machine",
    "Battery & power",
    "Assembly",
    [0, -0.15, 3.8],
    [23, 0.65, 11],
    "#33353a",
    "Stores energy and supplies portable operation.",
  ),
  ...[-10, -6.8, -2.6, 2.6, 6.8, 10].map((x, i) =>
    make(
      `battery-${i + 1}`,
      "power",
      `Battery pouch region ${i + 1}`,
      "Battery",
      [x, -0.15, 3.7],
      [i === 2 || i === 3 ? 4.85 : 2.75, 0.65, i === 2 || i === 3 ? 10.8 : 9.7],
      "#34383c",
      "Stores chemical energy for portable operation.",
      {
        shape: "cell",
        confidence: "reference-pending",
        source: "battery",
        specs:
          "58 Wh total pack. Six visible pouch regions are interpreted from the guide photos; actual internal cell topology is unknown.",
        engineer:
          "Lithium-ion chemistry stores energy by reversible ion transfer. Visible pouch divisions are not enough to establish the series/parallel electrical topology.",
        missing:
          "The guide warns some photos are from other models. Pouch dimensions are estimated, not measured.",
        repair:
          "Follow the full battery guide. Cells are adhered; puncture or deformation can cause fire.",
      },
    ),
  ),
  make(
    "bms",
    "power",
    "Battery management proxy",
    "Electronics",
    [0, -0.05, -2.5],
    [4, 0.2, 0.7],
    "#315f4b",
    "Monitors and controls battery operation.",
    {
      confidence: "illustrative",
      missing: "Location, IC identities and cell wiring unknown.",
    },
  ),
  make(
    "peripherals",
    "machine",
    "Audio, ports & hardware",
    "Assembly",
    [0, 0, 0],
    [30, 0.8, 20],
    "#4a5055",
    "Connects the computer to people and external devices.",
  ),
  make(
    "speaker-left",
    "peripherals",
    "Left speaker",
    "Audio",
    [-13, -0.1, 2],
    [2.7, 0.6, 9.5],
    "#30383d",
    "Converts electrical signals into sound.",
    { missing: "Internal chambers and driver dimensions not reconstructed." },
  ),
  make(
    "speaker-right",
    "peripherals",
    "Right speaker",
    "Audio",
    [13, -0.1, 2],
    [2.7, 0.6, 9.5],
    "#30383d",
    "Converts electrical signals into sound.",
  ),
  ...[-1, 1].flatMap((x) =>
    [-5.1, -7.1].map((z, i) =>
      make(
        `port-${x === -1 ? "left" : "right"}-${i + 1}`,
        "peripherals",
        `${x === -1 ? "Left" : "Right"} Thunderbolt 3 port ${i + 1}`,
        "Connector",
        [x * 15.13, 0.06, z],
        [0.18, 0.34, 1.05],
        "#161d24",
        "Carries compatible power, display and peripheral signals.",
        {
          shape: "port",
          confidence: "user-confirmed",
          source: "apple",
          specs:
            "Four Thunderbolt 3 ports in total; exact internal connector geometry unverified.",
        },
      ),
    ),
  ),
  make(
    "audio-jack",
    "peripherals",
    "Headphone jack",
    "Connector",
    [15.13, 0.06, 6.5],
    [0.18, 0.35, 0.35],
    "#161d24",
    "Connects a wired audio device.",
    { source: "apple" },
  ),
  make(
    "microphones",
    "peripherals",
    "Microphone array proxy",
    "Audio",
    [-12, 0.62, -0.8],
    [0.25, 0.08, 1.3],
    "#20262a",
    "Converts sound pressure into electrical signals.",
    {
      confidence: "illustrative",
      missing: "Capsule count and exact locations not verified.",
    },
  ),
  make(
    "antenna",
    "peripherals",
    "Antenna region proxy",
    "Radio",
    [0, -0.1, -10],
    [17, 0.2, 0.35],
    "#22272e",
    "Couples radio signals between circuits and free space.",
    {
      confidence: "illustrative",
      missing: "Element shapes and routing unknown.",
    },
  ),
  make(
    "flex",
    "peripherals",
    "Trackpad flex proxy",
    "Connector",
    [0, -0.37, 0],
    [1.1, 0.05, 4],
    "#aa7942",
    "Carries signals between the trackpad and board.",
    {
      confidence: "illustrative",
      missing: "Actual fold geometry, route and connector pins unknown.",
    },
  ),
  ...[-1, 1].flatMap((x) =>
    [-1, 1].map((z) =>
      make(
        `foot-${x}-${z}`,
        "lower",
        "Rubber foot",
        "Mechanical",
        [x * 12, -0.82, z * 8],
        [1.6, 0.2, 1.6],
        "#282d32",
        "Supports the enclosure on a surface.",
      ),
    ),
  ),
  ...[-1, 1].flatMap((x) =>
    [-1, 0, 1].map((z) =>
      make(
        `screw-${x}-${z}`,
        "lower",
        "Lower-case fastener proxy",
        "Fastener",
        [x * 14, -0.76, z * 9],
        [0.24, 0.12, 0.24],
        "#85898c",
        "Secures a cover to the enclosure.",
        {
          confidence: "illustrative",
          missing: "Count, thread, lengths and positions unverified.",
        },
      ),
    ),
  ),
];
// Keycaps are individually navigable, with an explicitly generic regional layout.
const rows = [
  "ESC 1 2 3 4 5 6 7 8 9 0 − = ⌫",
  "TAB Q W E R T Y U I O P [ ] \\",
  "CAPS A S D F G H J K L ; ' ENTER",
  "SHIFT Z X C V B N M , . / SHIFT",
  "FN CTRL OPT CMD SPACE CMD OPT ← ↑ ↓ →",
];
rows.forEach((row, r) =>
  row.split(" ").forEach((label, c) =>
    parts.push(
      make(
        `key-${r}-${c}`,
        "keyboard",
        `${label} key (layout proxy)`,
        "Keycap",
        [(c - (row.split(" ").length - 1) / 2) * 1.49, 0.72, -5.5 + r * 1.49],
        [1.34, 0.14, 1.29],
        "#242930",
        "A keycap transfers finger force to its underlying mechanism.",
        {
          shape: "key",
          confidence: "illustrative",
          specs:
            "Generic key spacing and regional layout; not verified A2251 key geometry.",
        },
      ),
    ),
  ),
);
// Evidence reconciliation: verified means the stated fact, never a measured mesh.
const verified: Record<string, Partial<Part>> = {
  machine: {
    confidence: "verified",
    source: "apple",
    specs:
      "A2251 / EMC 3348 (iFixit identification). Apple: 30.41 × 21.24 × 1.56 cm, 1.4 kg; 2020 four-port Intel model.",
    function:
      "A 13-inch, four-port Intel MacBook Pro. A2251 is distinct from the two-port A2289 and Apple Silicon models.",
  },
  panel: {
    confidence: "verified",
    source: "apple",
    specs:
      "13.3-inch IPS LED-backlit Retina display; 2560 × 1600 at 227 ppi; 500 nits; P3; True Tone. Optical layer geometry remains unmodeled.",
  },
  camera: {
    confidence: "verified",
    source: "apple",
    specs: "720p FaceTime HD camera. Sensor package identity unknown.",
  },
  cpu: {
    confidence: "verified",
    source: "apple",
    specs:
      "2.0 GHz quad-core 10th-gen Core i5 (Turbo 3.8 GHz, 6 MB L3), or 2.3 GHz Core i7 (Turbo 4.1 GHz, 8 MB L3); Intel Iris Plus graphics. Owner configuration unknown.",
  },
  memory: {
    confidence: "verified",
    source: "apple",
    specs:
      "16 GB 3733 MHz LPDDR4X onboard memory; configurable to 32 GB. Package count, identity and placement unknown.",
  },
  storage: {
    confidence: "verified",
    source: "apple",
    specs:
      "512 GB or 1 TB base SSD configurations; up to 4 TB. Flash and controller package identities and placement unknown.",
  },
  keyboard: {
    confidence: "verified",
    source: "apple",
    specs:
      "Backlit Magic Keyboard: 65 U.S. or 66 ISO keys; inverted-T arrows. iFixit confirms scissor mechanism. The displayed key layout is a selectable proxy.",
  },
  touchbar: {
    confidence: "verified",
    source: "apple",
    specs:
      "Touch Bar, separate physical Escape key and Touch ID button; regional dimensions unknown.",
  },
  touchid: { confidence: "verified", source: "apple" },
  trackpad: {
    confidence: "verified",
    source: "trackpad",
    specs:
      "Force Touch (Apple). Guide: 10 mounting screws, two 4.3 mm and eight 5.8 mm; six washers (two circular, four rectangular).",
    repair:
      "Guide steps 8–14 disconnect battery data and power before trackpad work. Steps 15–22 cover bracket, cable and trackpad. Use the complete linked guide.",
  },
  power: {
    confidence: "verified",
    source: "apple",
    specs:
      "58.0 Wh built-in lithium-polymer battery; 61 W USB-C adapter. Electrical cell topology remains unknown.",
  },
  lower: {
    confidence: "verified",
    source: "lower",
    specs:
      "Six P5 pentalobe screws: two 6.7 mm and four 3.4 mm. Four hidden clips plus sliding hinge-side clips. Exact positions remain approximate.",
    repair:
      "iFixit lower-case guide steps 1–7. Preserve screw locations; slide the rear clips free. The guide notes some photos come from another model.",
  },
  bms: {
    name: "Battery board",
    confidence: "verified",
    source: "battery",
    specs:
      "Battery board has data and power connections. Guide specifies two 3.2 mm T5 board screws and one 3.7 mm T5 power-connector screw.",
    missing: "Board IC identities, topology and geometry unknown.",
  },
  flex: {
    name: "Trackpad ribbon cable",
    confidence: "verified",
    source: "trackpad",
    specs:
      "Trackpad cable is adhered over the battery; two 1.8 mm T3 screws retain its connector bracket. Route is an approximate proxy.",
  },
  antenna: {
    name: "Antenna bar assembly",
    confidence: "verified",
    source: "antenna",
    specs:
      "Three coaxial connections to the logic board. Cable bundle passes under the heat pipe. Internal radiating-element shapes unknown.",
  },
  wireless: {
    confidence: "verified",
    source: "apple",
    specs:
      "802.11ac Wi-Fi (a/b/g/n compatible), Bluetooth 5.0. Package identity and placement unknown.",
  },
  microphones: {
    name: "Three-microphone array proxy",
    confidence: "verified",
    source: "apple",
    specs:
      "Three-mic array with directional beamforming. Individual microphone positions unknown.",
    missing: "Capsule package identities and positions not verified.",
  },
  "audio-jack": {
    confidence: "verified",
    source: "apple",
    specs: "3.5 mm headphone jack.",
  },
  "speaker-left": {
    confidence: "verified",
    source: "battery",
    specs:
      "Apple confirms stereo speakers. iFixit battery guide steps 25–27 place glued speakers either side of the battery.",
  },
  "speaker-right": {
    confidence: "verified",
    source: "battery",
    specs: "Stereo speaker; glued into the enclosure alongside the battery.",
  },
  heatpipe: {
    confidence: "verified",
    source: "antenna",
    missing:
      "A heat pipe is named in guide steps 24–25; exact routing, contact plates and fin geometry unverified.",
  },
};
for (const p of parts) {
  if (verified[p.id]) Object.assign(p, verified[p.id]);
  if (p.id.startsWith("port-")) {
    p.confidence = "verified";
    p.specs =
      "Thunderbolt 3 up to 40 Gb/s; USB 3.1 Gen 2 up to 10 Gb/s; charging and DisplayPort (Apple).";
  }
  if (p.id.startsWith("battery-"))
    p.specs =
      "Part of a verified 58.0 Wh pack. Six visible regions follow guide imagery; electrical cell topology remains unverified.";
  if (p.id.startsWith("screw-")) {
    p.source = "lower";
    p.specs =
      "Six lower-case fasteners verified: 2 × 6.7 mm and 4 × 3.4 mm P5. Mapping to these proxy positions is unverified.";
  }
}
for (const id of ["lid", "lower", "upper"]) {
  const p = parts.find((p) => p.id === id)!;
  p.geometry = "Tier 2 · dimension-based approximation";
  p.source = "apple";
  p.missing =
    "Overall width/depth anchored to Apple dimensions; corner radii, thickness distribution, fit and cutouts approximate.";
}
// Verified existence, representative geometry. No inferred chip identities.
parts.push(
  make(
    "battery-data",
    "bms",
    "Battery data ribbon",
    "Connector",
    [1, -0.05, -2],
    [0.6, 0.1, 1.2],
    "#b48243",
    "Carries battery management data.",
    {
      confidence: "verified",
      source: "battery",
      specs:
        "Guide steps 9–12 describe locking-tab connector and data cable. Pinout and placement approximate.",
    },
  ),
  make(
    "battery-power",
    "bms",
    "Battery power connector",
    "Connector",
    [-1, -0.05, -2],
    [0.7, 0.15, 1],
    "#aeafa5",
    "Connects battery power to the system.",
    {
      confidence: "verified",
      source: "battery",
      specs:
        "Guide steps 13–14: 3.7 mm T5 pancake screw and lift-to-disconnect connector.",
    },
  ),
  make(
    "trackpad-bracket",
    "flex",
    "Trackpad connector bracket",
    "Mechanical",
    [0, -0.15, -1],
    [1.6, 0.1, 0.6],
    "#9eaaa7",
    "Retains the trackpad cable connector.",
    {
      confidence: "verified",
      source: "trackpad",
      specs:
        "Two 1.8 mm T3 screws retain the bracket; dimensions and position approximate.",
    },
  ),
  make(
    "ambient-light",
    "lid",
    "Ambient light sensor proxy",
    "Sensor",
    [1, 0.74, 9.65],
    [0.22, 0.06, 0.15],
    "#1e2c2d",
    "Senses ambient illumination.",
    {
      confidence: "verified",
      source: "apple",
      missing: "Sensor location and package identity unknown.",
    },
  ),
  make(
    "fin-left",
    "cooling",
    "Left fin-stack proxy",
    "Cooling",
    [-10, 0.03, -8.8],
    [4, 0.5, 1],
    "#5b6264",
    "Increases surface area for heat exchange.",
    {
      confidence: "illustrative",
      missing: "Fin dimensions, count and duct routing unknown.",
    },
  ),
  make(
    "fin-right",
    "cooling",
    "Right fin-stack proxy",
    "Cooling",
    [10, 0.03, -8.8],
    [4, 0.5, 1],
    "#5b6264",
    "Increases surface area for heat exchange.",
    {
      confidence: "illustrative",
      missing: "Fin dimensions, count and duct routing unknown.",
    },
  ),
  make(
    "display-flex",
    "peripherals",
    "Display board flex connector",
    "Connector",
    [0, 0.04, -9.6],
    [1.5, 0.1, 0.5],
    "#b48a49",
    "Connects display electronics.",
    {
      confidence: "verified",
      source: "antenna",
      specs:
        "Guide steps 16–19 identify display cable covers and display-board flex connections. Exact signals are unknown.",
    },
  ),
);
// Blade count is a teaching sample, not measured fan geometry.
for (const fan of ["fan-left", "fan-right"]) {
  const origin = parts.find((p) => p.id === fan)!;
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    parts.push(
      make(
        `${fan}-blade-${i}`,
        fan,
        `Blade proxy ${i + 1}`,
        "Fan blade",
        [
          origin.position[0] + Math.cos(a) * 1.3,
          0.3,
          origin.position[2] + Math.sin(a) * 1.3,
        ],
        [1.05, 0.06, 0.18],
        "#77828b",
        "Moves air through the impeller when the fan rotates.",
        {
          shape: "blade",
          confidence: "illustrative",
          source: "battery",
          specs:
            "22 representative blades per rendered fan. Actual blade count, profile and handedness unknown.",
        },
      ),
    );
  }
}
export const byId = Object.fromEntries(parts.map((p) => [p.id, p]));
export const assemblies = parts.filter((p) => p.parent === "machine");
export function descendants(id: string): string[] {
  return [
    id,
    ...parts.filter((p) => p.parent === id).flatMap((p) => descendants(p.id)),
  ];
}
export function ancestors(id: string): Part[] {
  const p = byId[id];
  return p ? [...(p.parent ? ancestors(p.parent) : []), p] : [];
}
export const renderParts = parts.filter(
  (p) =>
    p.id !== "machine" &&
    (p.category !== "Assembly" || p.id === "logic") &&
    p.shape !== "blade",
);
export const modes = [
  "Explore",
  "Thermal",
  "Power",
  "Data",
  "Disassembly",
] as const;
export type Mode = (typeof modes)[number];
export const overlays: Record<
  Mode,
  { label: string; paths: string[][]; description: string }
> = {
  Explore: {
    label: "Spatial inspection",
    paths: [],
    description: "Select a component to inspect its role and evidence.",
  },
  Thermal: {
    label: "Simplified thermal model · no measured temperatures",
    paths: [
      ["cpu", "heatpipe", "fan-left"],
      ["cpu", "heatpipe", "fan-right"],
      ["fan-left", "fin-left"],
      ["fan-right", "fin-right"],
    ],
    description:
      "Amber: conceptual heat transfer. Blue: illustrative airflow toward rear fin regions. Arrows are qualitative; temperatures, flow rates and duct geometry are unverified.",
  },
  Power: {
    label: "Conceptual power flow · topology unverified",
    paths: [
      ["port-left-1", "power-ic", "bms", "battery-2"],
      ["bms", "power-ic", "cpu"],
    ],
    description:
      "Illustrates input, regulation, storage and consumers. This is not an A2251 circuit schematic or a verified charging route.",
  },
  Data: {
    label: "Functional relationships · routing unverified",
    paths: [
      ["cpu", "memory"],
      ["cpu", "storage"],
      ["cpu", "thunderbolt"],
    ],
    description:
      "CPU, memory, storage and external I/O have functional relationships. Lines omit intermediary controllers and do not claim direct electrical links.",
  },
  Disassembly: {
    label: "Source-backed order · simplified animation",
    paths: [],
    description:
      "Sequence summarized from iFixit A2251 lower-case, battery and trackpad guides. Tool motions, connectors and adhesive handling are simplified; use the complete source guide for repair.",
  },
};
export const disassembly = [
  {
    id: "lower",
    title: "Lower case · guide steps 1–7",
    detail:
      "Verified sequence: six P5 screws, four hidden clips, then sliding rear clips. Source: iFixit 143615. Some guide photos are from another model; this animation omits the clip motion.",
    source: "lower",
    hide: ["lower"],
  },
  {
    id: "battery-power",
    title: "Battery isolation · steps 8–14",
    detail:
      "Verified prerequisites: uncover battery connections, release the battery data cable, remove the 3.7 mm T5 power-connector screw, then disconnect power. The animation only marks these connections removed; the pack stays installed.",
    source: "battery",
    hide: ["battery-data", "battery-power"],
  },
  {
    id: "trackpad",
    title: "Trackpad · steps 15–22",
    detail:
      "Verified order: connector bracket, cable disconnect and adhesive release, ten mounting screws, then trackpad and six washers. This summary omits tool motions; follow the full guide for physical work.",
    source: "trackpad",
    hide: ["trackpad-bracket", "flex", "trackpad"],
  },
  {
    id: "power",
    title: "Battery pack · steps 23–44",
    detail:
      "Verified order: battery-board screws, protect display and speakers, release battery adhesive, then remove the pack. Real removal requires the complete guide and precautions; this animation is simplified.",
    source: "battery",
    hide: ["power"],
  },
];
