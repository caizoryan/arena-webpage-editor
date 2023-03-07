import { state } from "../State";
import type { Styles, State } from "./Types";

function transformState(newState: State) {
  updateMultiple(newState);
  for (const x of state) x.active = true;
  if (state.length > newState.length) {
    for (let i = newState.length; i < state.length; i++) {
      state[i].active = false;
    }
  }
}
function updateMultiple(state: State) {
  for (const x of state) {
    if (x.class) updateState(x.id, x.styles, x.children, x.class);
    else if (x.children) updateState(x.id, x.styles, x.children);
    else updateState(x.id, x.styles);
  }
}

function updateState(
  index: number,
  styles: Styles,
  children?: any[],
  cls?: string
) {
  if (state[index]) {
    for (const [key, value] of Object.entries(styles)) {
      if (value === "RESET") state[index].styles = {};
      else if (value === "DELETE" && state[index].styles[key])
        delete state[index].styles[key];
      else state[index].styles[key] = value;
    }
    if (children) state[index].children = children;
    if (cls) state[index].class = cls;
  } else {
    if (cls)
      state.push({
        id: index,
        styles: styles,
        active: true,
        children: children,
        class: cls,
      });
    else if (children)
      state.push({
        id: index,
        styles: styles,
        active: true,
        children: children,
      });
    else state.push({ id: index, styles: styles, active: true });
  }
}

function updateChildren(index: number, children: any[]) {
  state[index].children = children;
}

function quickUpdate(index: number | number[], style: string[][]) {
  if (typeof index === "number") {
    for (const x of style) {
      state[index].styles[x[0]] = x[1];
    }
  } else
    for (const i of index) {
      for (const x of style) {
        state[i].styles[x[0]] = x[1];
      }
    }
}

function styleToString(styles: Object) {
  // helper function
  const kebabize = (str: string) => {
    return str
      .split("")
      .map((letter: string, idx: number) => {
        return letter.toUpperCase() === letter
          ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
          : letter;
      })
      .join("");
  };

  let swap = "";
  for (const [key, value] of Object.entries(styles)) {
    swap += `${kebabize(key)}: ${value};`;
  }
  return swap;
}
export {
  updateChildren,
  updateMultiple,
  styleToString,
  quickUpdate,
  updateState,
  transformState,
};
