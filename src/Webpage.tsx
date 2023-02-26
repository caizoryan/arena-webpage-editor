import type { Component } from "solid-js";
import { For } from "solid-js";
import { ArenaClient } from "arena-ts";
import { WebpageProps } from "./types";

// make a webpage view
// make a sidebar that you can edit in

const Webpage: Component<WebpageProps> = (props: any) => {
  console.log(props.data);
  return <For each={props.data}>{(block) => <h1>{block.name}</h1>}</For>;
};

export default Webpage;
