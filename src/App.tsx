import {
  lazy,
  Suspense,
  useReducer,
  useState,
  useCallback,
  useEffect,
  useRef,
  Component,
  type ReactNode,
} from "react";
import {
  Box,
  Search,
  ChevronRight,
  ArrowUpRight,
  RotateCcw,
  Undo2,
  Eye,
  EyeOff,
  Focus,
  Layers,
  Maximize2,
  SlidersHorizontal,
  X,
  BookOpen,
  Check,
  Info,
  ChevronDown,
  Command,
  Download,
} from "lucide-react";
import {
  parts,
  byId,
  assemblies,
  ancestors,
  modes,
  overlays,
  disassembly,
  sources,
  type Part,
  type Mode,
} from "./manifest";
import { initial, reducer, visible } from "./state";
import type { Metrics } from "./Scene";
const Scene = lazy(() => import("./Scene"));
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-failure">
        <h2>3D rendering unavailable</h2>
        <p>
          Enable WebGL or use a supported browser. The searchable inventory and
          evidence panels remain available.
        </p>
      </div>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>(["enclosure"]);
  const [engineer, setEngineer] = useState(false);
  const [clip, setClip] = useState(0);
  const [quality, setQuality] = useState("Auto");
  const [autoLow, setAutoLow] = useState(false);
  const slowSamples = useRef(0);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [focusId, setFocusId] = useState("machine");
  const [resetToken, setResetToken] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [tab, setTab] = useState<"learn" | "evidence">("learn");
  const [help, setHelp] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setMobile(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === "Escape") {
        setHelp(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const selected = byId[state.selected];
  const choose = useCallback(
    (id: string) => dispatch({ type: "select", id }),
    [],
  );
  const focus = useCallback((id: string) => {
    dispatch({ type: "select", id });
    setFocusId(id);
    setFocusToken((n) => n + 1);
  }, []);
  const report = useCallback((m: Metrics) => {
    setMetrics(m);
    slowSamples.current = m.fps < 25 ? slowSamples.current + 1 : 0;
    if (slowSamples.current >= 2) setAutoLow(true);
  }, []);
  const changeMode = (mode: Mode) =>
    dispatch({
      type: "set",
      patch: { mode, ...(mode !== "Explore" ? { lid: 105, xray: 0.92 } : {}) },
    });
  const reset = () => {
    dispatch({ type: "reset" });
    setClip(0);
    setResetToken((n) => n + 1);
  };
  function tree(p: Part, depth = 0): ReactNode {
    const children = parts.filter((c) => c.parent === p.id);
    const open = expanded.includes(p.id);
    return (
      <div key={p.id}>
        <div
          className={`tree-row ${state.selected === p.id ? "selected" : ""} ${!visible(p.id, state) ? "muted" : ""}`}
          style={{ paddingLeft: 12 + depth * 13 }}
        >
          <button
            className="expand"
            aria-label={`${open ? "Collapse" : "Expand"} ${p.name}`}
            onClick={() =>
              setExpanded((x) =>
                open ? x.filter((id) => id !== p.id) : [...x, p.id],
              )
            }
            disabled={!children.length}
          >
            {children.length ? (
              open ? (
                <ChevronDown size={13} />
              ) : (
                <ChevronRight size={13} />
              )
            ) : (
              <span className="tree-dot" />
            )}
          </button>
          <button
            className="part-name"
            onClick={() => choose(p.id)}
            onDoubleClick={() => focus(p.id)}
          >
            {p.name}
          </button>
          <span className="tree-count">{children.length || ""}</span>
        </div>
        {open && children.map((c) => tree(c, depth + 1))}
      </div>
    );
  }
  const matches = parts.filter((p) =>
    (p.name + " " + p.function).toLowerCase().includes(query.toLowerCase()),
  );
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              model: "A2251",
              units: "cm",
              coordinateSystem: "+X right, +Y up, -Z rear",
              researchStatus:
                "Apple and iFixit specifications inspected; Tier 2 exterior dimensions and Tier 3 internals; no verified CAD",
              sources,
              components: parts,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    a.download = "a2251-component-manifest.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="app">
      <header>
        <a className="brand" href="#" aria-label="Engineering Explorer home">
          <span className="brand-symbol">
            <Box size={23} />
          </span>
          <span>
            FORM<span className="brand-divider">/</span>FUNCTION
          </span>
        </a>
        <div className="project-name">
          MacBook Pro <span>A2251</span>
        </div>
        <button className="quiet help-button" onClick={() => setHelp(true)}>
          <BookOpen size={15} /> Field notes
        </button>
      </header>
      <div className="workspace">
        <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
          <div className="side-top">
            <span className="eyebrow">COMPONENT LIBRARY</span>
            <button
              className="mobile-close icon"
              aria-label="Close component library"
              onClick={() => setMobile(false)}
            >
              <X size={17} />
            </button>
          </div>
          <h1>Inside the machine.</h1>
          <p className="side-intro">
            An engineering exploration of the
            <br />
            13-inch MacBook Pro, 2020.
          </p>
          <label className="search">
            <Search size={15} />
            <input
              ref={searchRef}
              aria-label="Search components"
              placeholder="Find a component or function"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span>⌘ K</span>
          </label>
          <div className="tree-header">
            <span>ASSEMBLY TREE</span>
            <span>{parts.length} entries</span>
          </div>
          <nav aria-label="Component hierarchy" className="tree">
            <button
              className={`root-row ${state.selected === "machine" ? "selected" : ""}`}
              onClick={() => choose("machine")}
            >
              <Box size={15} />
              <span>MacBook Pro A2251</span>
            </button>
            {query
              ? matches.map((p) => (
                  <button
                    key={p.id}
                    className="search-result"
                    onClick={() => {
                      choose(p.id);
                      setMobile(false);
                    }}
                  >
                    {p.name}
                    <ChevronRight size={13} />
                  </button>
                ))
              : assemblies.map((p) => tree(p))}
          </nav>
          <div className="library-foot">
            <span className="status-dot" /> RESEARCH EDITION <span>01</span>
          </div>
          <div className="accuracy-card">
            <Info size={16} />
            <div>
              <strong>Know what you’re looking at.</strong>
              <p>
                Verified specifications. Approximate exterior. Illustrative
                internals.
              </p>
              <button
                onClick={() => {
                  setTab("evidence");
                  choose("machine");
                }}
              >
                View accuracy & sources <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </aside>
        <main className="viewer">
          <div className="viewer-top">
            <div className="breadcrumbs">
              {ancestors(state.selected).map((p, i) => (
                <span key={p.id}>
                  {i > 0 && <ChevronRight size={11} />}
                  <button onClick={() => choose(p.id)}>
                    {p.id === "machine" ? "A2251" : p.name}
                  </button>
                </span>
              ))}
            </div>
            <span className="view-label">
              <span /> LIVE 3D VIEW
            </span>
          </div>
          <div className="scene">
            <SceneBoundary>
              <Suspense
                fallback={
                  <div className="loading">Preparing the inspection table…</div>
                }
              >
                <Scene
                  state={state}
                  clip={clip}
                  quality={quality === "Auto" && autoLow ? "Low" : quality}
                  onSelect={choose}
                  onFocus={focus}
                  focusId={focusId}
                  focusToken={focusToken}
                  resetToken={resetToken}
                  onMetrics={report}
                />
              </Suspense>
            </SceneBoundary>
          </div>
          <div className="scene-heading">
            <span className="eyebrow">DESIGNED TO BE UNDERSTOOD</span>
            <h2>
              {state.mode === "Explore"
                ? "A closer look."
                : `${state.mode}, revealed.`}
            </h2>
            <p>
              {state.mode === "Explore"
                ? "Explore the systems behind the surface."
                : overlays[state.mode].label}
            </p>
          </div>
          <button
            className="mobile-library quiet"
            onClick={() => setMobile(true)}
          >
            <Layers size={16} /> Components
          </button>
          <div className="view-tools">
            <button
              title="Reset camera and model"
              aria-label="Reset camera and model"
              onClick={reset}
            >
              <RotateCcw size={17} />
            </button>
            <button
              title="Undo navigation"
              aria-label="Undo navigation"
              disabled={!state.history.length}
              onClick={() => dispatch({ type: "undo" })}
            >
              <Undo2 size={17} />
            </button>
            <span />
            <button
              title="Focus selection"
              aria-label="Focus selection"
              onClick={() => focus(state.selected)}
            >
              <Focus size={17} />
            </button>
            <button
              title="Restore all components"
              aria-label="Restore all components"
              onClick={() => dispatch({ type: "restore" })}
            >
              <Eye size={17} />
            </button>
          </div>
          <div className="model-caption">
            <span className="caption-rule" />
            <div>
              <strong>MacBook Pro 13″</strong>
              <span>2020 / Intel / Four Thunderbolt 3 ports</span>
            </div>
            <span className="geometry-label">APPROXIMATE / ILLUSTRATIVE</span>
          </div>
          {state.mode === "Disassembly" && (
            <div className="disassembly">
              <span className="eyebrow">SOURCE-BACKED / SIMPLIFIED</span>
              <strong>
                {state.step + 1}. {disassembly[state.step].title}
              </strong>
              <p>{disassembly[state.step].detail}</p>
              <a
                className="sequence-source"
                href={
                  sources[
                    disassembly[state.step].source as keyof typeof sources
                  ].url
                }
                target="_blank"
                rel="noreferrer"
              >
                Read the full source guide ↗
              </a>
              <button
                className="primary"
                onClick={() => {
                  disassembly[state.step].hide.forEach((id) =>
                    dispatch({ type: "hide", id }),
                  );
                  dispatch({
                    type: "set",
                    patch: { step: Math.min(3, state.step + 1) },
                  });
                }}
                disabled={state.step === 3 && !visible("power", state)}
              >
                {state.step === 3 ? "Hide final assembly" : "Hide & continue"}{" "}
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          <div className="bottom-controls">
            <div className="mode-bar" role="tablist" aria-label="Learning mode">
              {modes.map((mode, i) => (
                <button
                  key={mode}
                  role="tab"
                  aria-selected={state.mode === mode}
                  className={state.mode === mode ? "active" : ""}
                  onClick={() => changeMode(mode)}
                >
                  <span className="mode-number">0{i + 1}</span>
                  {mode}
                </button>
              ))}
            </div>
            <div className="sliders">
              <label>
                <span>
                  <Maximize2 size={13} /> Lid <b>{state.lid}°</b>
                </span>
                <input
                  aria-label="Lid angle"
                  type="range"
                  min="0"
                  max="125"
                  value={state.lid}
                  onChange={(e) =>
                    dispatch({ type: "set", patch: { lid: +e.target.value } })
                  }
                />
              </label>
              <label>
                <span>
                  <Eye size={13} /> X-ray <b>{Math.round(state.xray * 100)}%</b>
                </span>
                <input
                  aria-label="X-ray"
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  value={state.xray}
                  onChange={(e) =>
                    dispatch({ type: "set", patch: { xray: +e.target.value } })
                  }
                />
              </label>
              <label>
                <span>
                  <Layers size={13} /> Explode{" "}
                  <b>{Math.round(state.explode * 100)}%</b>
                </span>
                <input
                  aria-label="Explode"
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  value={state.explode}
                  onChange={(e) =>
                    dispatch({
                      type: "set",
                      patch: { explode: +e.target.value },
                    })
                  }
                />
              </label>
              <label>
                <span>
                  <SlidersHorizontal size={13} /> Section{" "}
                  <b>{Math.round(clip * 100)}%</b>
                </span>
                <input
                  aria-label="Cross section"
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  value={clip}
                  onChange={(e) => setClip(+e.target.value)}
                />
              </label>
            </div>
          </div>
        </main>
        <aside className="inspector">
          <div className="inspector-top">
            <span className="eyebrow">INSPECTOR</span>
            <span className="index-number">
              {String(parts.indexOf(selected) + 1).padStart(3, "0")}
            </span>
          </div>
          <div className="part-illustration">
            <Box size={58} strokeWidth={0.8} />
            <span>{selected.category}</span>
          </div>
          <span className="eyebrow part-category">
            {selected.category.toUpperCase()}
          </span>
          <h2>{selected.name}</h2>
          <span
            className={`confidence ${["verified", "user-confirmed"].includes(selected.confidence) ? "confirmed" : ""}`}
          >
            {["verified", "user-confirmed"].includes(selected.confidence) ? (
              <Check size={12} />
            ) : (
              <Info size={12} />
            )}{" "}
            {selected.confidence === "verified"
              ? "Fact verified · geometry approximate"
              : selected.confidence === "user-confirmed"
                ? "Identity confirmed by owner"
                : selected.confidence === "illustrative"
                  ? "Illustrative proxy"
                  : "Reference verification pending"}
          </span>
          <div className="selection-actions">
            <button
              onClick={() => dispatch({ type: "isolate", id: state.selected })}
            >
              <Focus size={14} />
              {state.isolated === state.selected ? "Unisolate" : "Isolate"}
            </button>
            <button
              onClick={() => dispatch({ type: "hide", id: state.selected })}
            >
              <EyeOff size={14} /> Hide
            </button>
            <button
              aria-label="Focus selected component"
              onClick={() => focus(state.selected)}
            >
              <Maximize2 size={14} />
            </button>
          </div>
          <div className="info-tabs">
            <button
              className={tab === "learn" ? "active" : ""}
              onClick={() => setTab("learn")}
            >
              Overview
            </button>
            <button
              className={tab === "evidence" ? "active" : ""}
              onClick={() => setTab("evidence")}
            >
              Evidence & geometry
            </button>
          </div>
          {tab === "learn" ? (
            <>
              <div className="explanation-switch">
                <span>EXPLANATION</span>
                <button
                  className={!engineer ? "active" : ""}
                  onClick={() => setEngineer(false)}
                >
                  Beginner
                </button>
                <button
                  className={engineer ? "active" : ""}
                  onClick={() => setEngineer(true)}
                >
                  Engineer
                </button>
              </div>
              <p className="description">
                {engineer ? selected.engineer : selected.function}
              </p>
              <h3>Technical notes</h3>
              <p>{selected.specs}</p>
              <h3>Within the system</h3>
              <p>
                {selected.parent
                  ? `Part of ${byId[selected.parent].name}. ${selected.location}`
                  : "The complete assembly. Orientation is defined from above the keyboard, with the hinge at the rear."}
              </p>
              {selected.parent && (
                <button
                  className="related"
                  onClick={() => choose(selected.parent!)}
                >
                  <Box size={14} />
                  {byId[selected.parent].name}
                  <ChevronRight size={13} />
                </button>
              )}
              <h3>Repair considerations</h3>
              <p>{selected.repair}</p>
              <p className="small-note">
                Model-specific failure symptoms are not included without
                supporting evidence.
              </p>
            </>
          ) : (
            <>
              <h3>Geometry provenance</h3>
              <p>
                {selected.geometry}. Procedurally authored for this application.
                No CAD or teardown images were imported.
              </p>
              <h3>Verification status</h3>
              <p>
                Apple specifications and iFixit guides were inspected on 14
                October 2026. Verification covers the stated specification or
                existence, not package placement or measured geometry. iFixit
                warns that some guide photos show other models.
              </p>
              {selected.missing && (
                <>
                  <h3>Unresolved detail</h3>
                  <p>{selected.missing}</p>
                </>
              )}
              <h3>Source reference</h3>
              <a
                className="source-link"
                href={sources[selected.source as keyof typeof sources].url}
                target="_blank"
                rel="noreferrer"
              >
                {sources[selected.source as keyof typeof sources].name}
                <ArrowUpRight size={15} />
              </a>
              <button className="download" onClick={download}>
                <Download size={14} /> Export component manifest
              </button>
            </>
          )}
          {state.mode !== "Explore" && (
            <div className="mode-note">
              <strong>{overlays[state.mode].label}</strong>
              <p>{overlays[state.mode].description}</p>
            </div>
          )}
        </aside>
      </div>
      <footer>
        <span>
          <Command size={12} /> Drag to orbit <i /> Scroll to zoom <i />{" "}
          Right-drag to pan <i /> Double-click to focus
        </span>
        <div>
          <span className="performance">
            {metrics
              ? `${metrics.fps} fps · ${metrics.calls} draws · ${(metrics.triangles / 1000).toFixed(1)}k tris`
              : "Measuring renderer…"}
          </span>
          <label>
            Quality{" "}
            <select
              aria-label="Graphics quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option>Auto</option>
              <option>High</option>
              <option>Low</option>
            </select>
          </label>
        </div>
      </footer>
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Field notes"
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="icon modal-close"
              aria-label="Close field notes"
              onClick={() => setHelp(false)}
            >
              <X size={20} />
            </button>
            <span className="eyebrow">FIELD NOTES / RESEARCH EDITION</span>
            <h2>A model with visible limits.</h2>
            <p>
              This working explorer is the first inspection scaffold for an
              A2251 digital twin. Exterior dimensions are anchored to Apple
              specifications (Tier 2); internals remain Tier 3. Board layouts,
              package identities and battery divisions are not reconstructed.
              The disassembly order cites iFixit, with simplified animation.
            </p>
            <p>
              Open the lid and increase X-ray to inspect the interior. Select
              from the tree or the scene, then isolate or focus a component.
              Each component carries its own provenance and unknowns.
            </p>
            <p>
              Thermal, power and data overlays teach conceptual relationships.
              They are not measurements or reconstructed circuits.
            </p>
            <button
              className="primary"
              onClick={() => {
                setHelp(false);
                setTab("evidence");
              }}
            >
              Explore the evidence <ArrowUpRight size={15} />
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
export default App;
