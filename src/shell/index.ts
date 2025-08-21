import { type State } from "..";

import { setupCanvasResize } from "./browser-resize";
import { runFPS } from "./debug-panel/fps-runner";
import { setupPanelToggle } from "./hud";
import {
  setupControlButtons,
  initializeCameraControls,
  DEFAULT_VIEWPORT_SIZE_AND_ZOOM,
} from "./camera-controls";
import { startGameLoop } from "./game-loop";

import { generateGrid, type Position } from "../core";

export function init() {
  const initialPosition: Position = {
    x: Math.round(Math.random() * 50) + 1,
    y: Math.round(Math.random() * 50) + 1,
  } as const;

  const state: State = {
    game: {
      grid: generateGrid(),
      cat: {
        x: initialPosition.x,
        y: initialPosition.y,
      },
    },
    view: {
      canvas: document.getElementById("canvas") as HTMLCanvasElement,
      camera: {
        x: initialPosition.x,
        y: initialPosition.y,
        z: DEFAULT_VIEWPORT_SIZE_AND_ZOOM,
      },
    },
  };

  setupPanelToggle();
  setupCanvasResize(state);
  setupControlButtons(state);
  initializeCameraControls(state);
  startGameLoop(state, runFPS());
}
