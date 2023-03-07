export type Styles = {
  [key: string]: string;
};
export type Box = {
  id: number;
  styles: Styles;
  children?: any[];
  active: Boolean;
  class?: string;
};

export type State = Box[];
