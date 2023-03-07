import type { State } from "./Generator/Types";
import { createMutable } from "solid-js/store";

const state = createMutable<State>([
  {
    id: 0,
    styles: {
      position: "absolute",
      backgroundColor: "yellow",
      transform: "rotate(1deg)",
      transition: "all 400ms ease-in-out",
      top: "2vh",
      left: "2vw",
      width: "48vw",
      height: "96vh",
    },
    active: true,
  },
  {
    id: 1,
    styles: {
      position: "absolute",
      backgroundColor: "black",
      transform: "rotate(1deg)",
      transition: "all 400ms ease-in-out",
      top: "2vh",
      right: "2vw",
      width: "48vw",
      height: "96vh",
    },
    active: true,
  },
]);

export { state };
