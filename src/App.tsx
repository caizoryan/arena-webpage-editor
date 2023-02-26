import { Component, createEffect, createMemo, createSignal } from "solid-js";
import { ArenaClient } from "arena-ts";
import { createStore } from "solid-js/store";
import Sidebar from "./Sidebar";
import Webpage from "./Webpage";
import token from "./token";
import "./style.css";
import type { Data, CssData } from "./types";

const client = new ArenaClient({ token: token });
client
  .channel("gd2-project1-process")
  .contents()
  .then((res) => setData([...res.contents]));

// will recieve data from
let [data, setData] = createSignal<Data>([]);
let [cssData, setCssData] = createSignal<CssData>([]);
let [style, setStyle] = createSignal("h1{font-size: 1000px;}");

let classes = createMemo(() => {
  let titleList: string[] = data().map((block) => block.title);
  return [...new Set(titleList)];
});

createEffect(() => {
  let d = classes().map((c) => {
    return { class: c, code: `.${c} { \n}` };
  });
  setCssData([...d]);
});

createEffect(() => {
  // on change update dom to add this data onto it
  let code = "";
  for (const x of cssData()) {
    code += `${x.code}`;
  }
  setStyle(code);
});

const App: Component = () => {
  return (
    <>
      <style>{style()}</style>
      <div class="main-container">
        <Webpage data={data()}></Webpage>
        <Sidebar
          data={data()}
          setData={setData}
          classes={classes()}
          css={cssData()}
          setCss={setCssData}
        ></Sidebar>
      </div>
    </>
  );
};

export default App;
