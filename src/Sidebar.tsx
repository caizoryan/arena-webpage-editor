import { Component, createSignal, createEffect } from "solid-js";
import type { SidebarProps } from "./types";
import "./style.css";
import EditorJS from "@editorjs/editorjs";
import CodeTool from "@editorjs/code";

// a dropdown to select available classes
// css text box

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
    // defaultBlock: CodeTool,
  });

  // on change, take the blocks
  // make snippets
  // then set css
  return (
    <div class="sidebar-container">
      <div id="editorjs"></div>
    </div>
  );
};

export default Sidebar;
