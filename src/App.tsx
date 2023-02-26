import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from "solid-js";
import { ArenaClient } from "arena-ts";
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
let [cssData, setCssData] = createSignal<string[]>([]);
let [style, setStyle] = createSignal("h1{font-size: 1000px;}");
let [editorData, setEditorData] = createSignal([]);

let classes = createMemo(() => {
  return [...new Set(data().map((block) => block.title))];
});

createEffect(() => {
  let outputData: any = editorData();
  let temp;
  if (outputData.blocks) {
    temp = outputData.blocks.map((block) => {
      if (block.data.text) return block.data.text;
      else if (block.data.code) return block.data.code;
      else console.log("added another tool?");
    });
  } else {
    temp = [];
  }

  console.log(temp);
  setCssData(temp);
});

createEffect(() => {
  // on change update dom to add this data onto it
  let code = "";
  if (cssData()) for (const x of cssData()) code += `${x}`;
  setStyle(code);
});

const App: Component = () => {
  return (
    <>
      <style>{style()}</style>

      <div class="main-container">
        <Webpage data={data()}></Webpage>
        <Sidebar
          editorData={editorData()}
          setEditorData={setEditorData}
        ></Sidebar>
      </div>
    </>
  );
};

export default App;
