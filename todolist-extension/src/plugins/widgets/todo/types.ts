import { API } from "../../types";
import { State } from "./reducer";

export type CustomList = {
  id: string;
  name: string;
};

export type Data = {
  items: State;
  show: number;
  keyBind?: string;
  lastClearedDate?: string;
  customLists?: CustomList[];
};

export type Props = API<Data>;

export const defaultData: Data = {
  items: [],
  show: 3,
  keyBind: "T",
  customLists: [],
};
