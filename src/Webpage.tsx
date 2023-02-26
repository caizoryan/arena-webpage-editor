import { Component, Switch } from "solid-js";
import { For, Match } from "solid-js";
import { WebpageProps } from "./types";
import "./style.css";

const Webpage: Component<WebpageProps> = (props: any) => {
  console.log(props.data);
  return (
    <div class="webpage-container">
      <For each={props.data}>
        {(block) => (
          <Switch>
            <Match when={block.class === "Text"}>
              <p class={block.title}>{block.content}</p>
            </Match>
            <Match when={block.class === "Image"}>
              <img class={block.title} src={block.image.original.url}></img>
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
};

export default Webpage;
