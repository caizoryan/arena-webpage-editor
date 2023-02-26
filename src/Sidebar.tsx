import {
  For,
  Component,
  createSignal,
  createEffect,
  createMemo,
} from "solid-js";
import type { SidebarProps } from "./types";
import "./style.css";

// a dropdown to select available classes
// css text box

const Sidebar: Component<SidebarProps> = (props) => {
  const [selected, setSelected] = createSignal("");
  const [inputValue, setInputValue] = createSignal("");
  const [currentValue, setCurrentValue] = createSignal(0);

  function handleInput(e: any) {
    let swap = props.css.map((block) => {
      if (block.class === selected())
        return { class: block.class, code: e.currentTarget.value };
      else return { class: block.class, code: block.code };
    });
    props.setCss(swap);
  }
  createEffect(() => {
    if (props.css.length === 0) {
      console.log("hmmmm");
    } else {
      console.log(props.css);
      setCurrentValue(props.css.findIndex((css) => css.class === selected()));
    }
  });

  createEffect(() => {
    if (props.css.length != 0) setInputValue(props.css[currentValue()].code);
  });

  // https://github.com/LXSMNSYC/solid-tiptap
  return (
    <div class="sidebar-container">
      <select
        onChange={(e) => {
          setSelected(e?.currentTarget?.value);
        }}
      >
        <For each={props.classes}>
          {(classTitle) => <option>{classTitle}</option>}
        </For>
      </select>
      <input
        type="text"
        class="css-input"
        value={inputValue()}
        onInput={(e) => {
          handleInput(e);
        }}
      ></input>
    </div>
  );
};

export default Sidebar;
