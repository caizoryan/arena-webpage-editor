import EitorJS from "@editorjs/editorjs";
import CodeTool from "@editorjs/code";
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
import Webpage from "./Webpage";
import "./style.css";
import type { Data } from "./types";
import { Layout } from "./Generator/Layout";
import { render } from "solid-js/web";

import type { SidebarProps } from "./types";
import "./style.css";
import { state } from "./State";
import { transformState, updateChildren } from "./Generator/Utils";
import { State } from "./Generator/Types";

const Sidebar: Component<SidebarProps> = (props) => {
  const [currentValue, setCurrentValue] = createSignal(0);

  const editor = new EditorJS({
    holder: "editorjs",
    tools: {
      code: {
        class: CodeTool,
      },
    },
    onChange: (api, event) => {
      editor.save().then((outputData) => {
        props.setEditorData(outputData);
      });
    },
    data: {
      blocks: [
        {
          type: "code",
          data: {
            code: "img{\nwidth:80%;\n}",
          },
        },
      ],
    },
    autofocus: true,
  });

  return (
    <div class="sidebar-container">
      <div id="editorjs"></div>
    </div>
  );
};
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

  setCssData(temp);
});

createEffect(() => {
  // on change update dom to add this data onto it
  let code = "";
  if (cssData()) for (const x of cssData()) code += `${x}`;
  setStyle(code);
});

// updateChildren(1, [
//   <Sidebar editorData={editorData()} setEditorData={setEditorData}></Sidebar>,
// ]);

const LoadChannel = () => {
  return (
    <div class="load-channel">
      <p>Load Channel</p>
      <input
        type="text"
        onInput={(e) => {
          searchChannel(e.currentTarget.value);
        }}
      ></input>
    </div>
  );
};
const SearchResults = () => {
  return (
    <div class="search-results-container">
      <Show when={searchResults()?.channels}>
        <For each={searchResults()?.channels}>
          {(channel) => (
            <p class="results" onClick={() => loadChannel(channel.slug)}>
              {channel.title}
              <br></br>
              <span class="user-name">{channel.user.full_name}</span>
            </p>
          )}
        </For>
      </Show>
    </div>
  );
};

const WelcomeText = () => {
  return (
    <div class="welcome-text-container">
      <h1>What is Student Archive</h1>
      <p>
        Student archive is a practice to document and preserve the work of OCAD
        students. The website, the platform is meant to visualize all the
        various views How can an archive contribute to a community? <br></br>How
        can student projects turn into a platform just not meant for preserving
        the work but also an oppoturnity to expand, collaborate and
      </p>

      <br></br>
      <h1>Huh? Are.na?</h1>
      <p>
        Student Archive is built on top of Are.na, what this basically means is
        that we use Are.na's already existing infrastructure to manage the
        content that gets displayed here. So in order to add your work, you will
        need an Are.na account (and it's free! Why don't you have it already?)
      </p>
      <h1>What about our Are.na account's security?</h1>
      <p>
        Don't worry, we have our own Are.na accounts. If you're still worried,
        the source code is open source. Your are.na authentication is stored
        locally on your device so only your current device will have access to
        it. The server doesn't store that data.
      </p>
    </div>
  );
};

const GenerateToken = () => {
  return (
    <div class="sign-up">
      <h1>Enter your token Are.na token</h1>
      <div class="token-input">
        <input
          type="text"
          onInput={(e) => {
            setInput(e.currentTarget.value);
          }}
        ></input>
        <button
          style="margin-right: 10px"
          onClick={() => {
            hasToken(input());
            state2();
          }}
        >
          save
        </button>
      </div>
      <p>
        Generate it <a href="https://arena-token-gen.vercel.app/">here</a>, it
        will be stored in your local storage
      </p>
      <p>
        If you do not have an are.na account, <a href="">go sign up!</a>
      </p>
    </div>
  );
};

const stateObject2: State = [
  {
    id: 0,
    styles: {
      top: "3vh",
      left: "1vw",
      width: "98vw",
      height: "20vh",
      transform: "rotate(-1deg)",
      backgroundColor: "rgb(248, 248, 248)",
    },
    active: true,
    children: [<LoadChannel></LoadChannel>],
  },
  {
    id: 1,
    styles: {
      top: "22vh",
      right: "1vw",
      width: "94vw",
      height: "78vh",
      overflowY: "scroll",
      transform: "rotate(1.5deg)",
      backgroundColor: "yellow",
    },
    active: true,
    children: [<SearchResults></SearchResults>],
  },
];

// STATES
// 1. Main, sign up
function state1() {
  updateChildren(0, [<WelcomeText></WelcomeText>]);
  updateChildren(1, [<GenerateToken></GenerateToken>]);
}
// 2. Load channel
function state2() {
  transformState(stateObject2);
}

state2();
// 3. See out put

const App: Component = () => {
  return (
    <>
      <Layout state={state}></Layout>
    </>
  );
};

const root = document.getElementById("root");
render(() => <App />, root!);
