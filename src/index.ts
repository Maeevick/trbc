import { GameState } from "./core";
import { init } from "./shell";
import { ViewState } from "./shell/state";

export type State = {
  game: GameState;
  view: ViewState;
};

window.addEventListener("DOMContentLoaded", init);
