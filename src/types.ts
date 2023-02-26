import { ArenaChannelContents } from "arena-ts";
export type SidebarProps = {
  data: Object;
  setData: Function;
  classes: string[];
  css: CssBlock[];
  setCss: Function;
};

export type WebpageProps = {
  data: Object;
};

export type Data = ArenaChannelContents[];

export type CssBlock = {
  class: string;
  code: string;
};

export type CssData = CssBlock[];
