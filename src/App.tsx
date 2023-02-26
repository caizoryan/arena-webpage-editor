import { Component } from "solid-js";
import { ArenaClient } from "arena-ts";
import { createStore } from "solid-js/store";
import Sidebar from "./Sidebar";
import Webpage from "./Webpage";
import token from "./token";

const client = new ArenaClient({ token: token });
let [data, setData] = createStore({
  blocks: [{ name: "hello" }, { name: "world" }],
});
// make a webpage view
// make a sidebar that you can edit in

const App: Component = () => {
  return (
    <>
      <Sidebar data={data} setData={setData}></Sidebar>
      <Webpage data={data.blocks}></Webpage>
    </>
  );
};

export default App;
