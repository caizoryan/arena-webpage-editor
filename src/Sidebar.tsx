import type { Component } from "solid-js";
import type { SidebarProps } from "./types";

const Sidebar: Component<SidebarProps> = (props) => {
  function handleClick() {
    props.setData("blocks", (blocks: Array<Object>) => [
      ...blocks,
      { name: "yoooo" },
    ]);
  }

  return <button onClick={handleClick}>add world</button>;
};

export default Sidebar;
