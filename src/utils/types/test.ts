import type { RootState } from "../../app/store/store";


export type RenderOptions = {
  route?: string;
  path?: string;
  preloadedState?: Partial<RootState>;
};