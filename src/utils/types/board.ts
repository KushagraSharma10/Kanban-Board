import type { RootState } from "../../app/store/store";
import type { BoardItem } from "./dashboard";

export type BoardsState = {
  items: BoardItem[];
};

export type RenderOptions = {
  route?: string;
  path?: string;
  preloadedState?: Partial<RootState>;
};