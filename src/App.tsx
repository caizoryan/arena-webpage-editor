import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { ArenaClient } from "arena-ts";
import type { SearchApiResponse } from "arena-ts";
import { createLocalStorage } from "@solid-primitives/storage";
import Sidebar from "./Sidebar";
import Webpage from "./Webpage";
import "./style.css";
import type { Data, CssData } from "./types";

const [store, setStore] = createLocalStorage();
const [token, setToken] = createSignal("");
const [searchResults, setSearchResults] = createSignal<SearchApiResponse>();

let client: ArenaClient;

onMount(() => {
  if (!store.token) console.log("ask for token");
  else hasToken(store.token);
});

function hasToken(t: string) {
  setStore("token", t);
  client = new ArenaClient({ token: t });
}

function loadChannel(slug: string) {
  client
    .channel(slug)
    .contents()
    .then((res) => setData([...res.contents]));
}

function searchChannel(query: string) {
  client.search.channels(query, { per: 10 }).then((res) => {
    setSearchResults(res);
  });
}

// TODO
// add local storage: https://github.com/solidjs-community/solid-primitives/blob/main/packages/storage/src/storage.ts
// save an edit session
let [data, setData] = createSignal<Data>([]);
let [cssData, setCssData] = createSignal<string[]>([]);
let [style, setStyle] = createSignal("h1{font-size: 1000px;}");
let [editorData, setEditorData] = createSignal([]);
const [input, setInput] = createSignal("");

let classes = createMemo(() => {
  return [...new Set(data().map((block) => block.title))];
});

createEffect(() => {
  let outputData: any = editorData();
  let temp;
  if (outputData.blocks) {
    temp = outputData.blocks.map((block: any) => {
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
      <div class="main-container">
        <Webpage data={data()} style={style()}></Webpage>
        <Sidebar
          editorData={editorData()}
          setEditorData={setEditorData}
        ></Sidebar>
      </div>
      <div class="load-channel">
        <Show when={!store.token}>
          <p style="margin-right: 10px">Enter your token</p>
          <input
            style="margin-right: 10px"
            type="text"
            onInput={(e) => {
              setInput(e.currentTarget.value);
            }}
          ></input>
          <button style="margin-right: 10px" onClick={() => hasToken(input())}>
            save
          </button>
          <p>
            Generate it <a href="https://arena-token-gen.vercel.app/">here</a>,
            it will be stored in local storage
          </p>
        </Show>

        <Show when={store.token}>
          <p style="margin-right: 10px">Load Channel</p>
          <input
            style="height: 25px;margin-right: 10px"
            type="text"
            onInput={(e) => {
              searchChannel(e.currentTarget.value);
            }}
          ></input>

          <div>
            <Show when={searchResults()?.channels}>
              <For each={searchResults()?.channels}>
                {(channel) => (
                  <p class="results" onClick={() => loadChannel(channel.slug)}>
                    {channel.title}
                  </p>
                )}
              </For>
            </Show>
          </div>
        </Show>
      </div>
    </>
  );
};

export default App;
