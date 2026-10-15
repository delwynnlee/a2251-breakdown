import { byId, descendants, type Mode } from "./manifest";
export type Snapshot = {
  selected: string;
  hidden: string[];
  isolated: string | null;
  lid: number;
  xray: number;
  explode: number;
  mode: Mode;
  step: number;
};
export type State = Snapshot & { history: Snapshot[] };
export const initial: State = {
  selected: "machine",
  hidden: [],
  isolated: null,
  lid: 0,
  xray: 0,
  explode: 0,
  mode: "Explore",
  step: 0,
  history: [],
};
export type Action =
  | { type: "select"; id: string }
  | { type: "hide"; id: string }
  | { type: "isolate"; id: string }
  | { type: "restore" }
  | { type: "undo" }
  | { type: "reset" }
  | { type: "set"; patch: Partial<Snapshot> };
export function reducer(state: State, action: Action): State {
  if (action.type === "undo") {
    const old = state.history.at(-1);
    return old ? { ...old, history: state.history.slice(0, -1) } : state;
  }
  if (action.type === "reset") return { ...initial };
  const { history, ...snapshot } = state;
  let next: Snapshot = { ...snapshot };
  if (action.type === "select") {
    if (!byId[action.id]) return state;
    next.selected = action.id;
  }
  if (action.type === "hide") {
    if (!byId[action.id]) return state;
    next.hidden = [...new Set([...state.hidden, action.id])];
  }
  if (action.type === "isolate") {
    if (!byId[action.id]) return state;
    next.isolated = state.isolated === action.id ? null : action.id;
    next.selected = action.id;
  }
  if (action.type === "restore") {
    next.hidden = [];
    next.isolated = null;
  }
  if (action.type === "set") next = { ...next, ...action.patch };
  return { ...next, history: [...history.slice(-39), snapshot] };
}
export function visible(id: string, state: Pick<State, "hidden" | "isolated">) {
  return (
    !state.hidden.some((h) => descendants(h).includes(id)) &&
    (!state.isolated || descendants(state.isolated).includes(id))
  );
}
