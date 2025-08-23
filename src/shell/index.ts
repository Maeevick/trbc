import { type State } from "..";

import { setupCanvasResize } from "./browser/resize";
import { runFPS } from "./debug-panel/fps-runner";
import { setupPanelToggle } from "./hud";
import {
  setupControlButtons,
  initializeCameraControls,
  DEFAULT_VIEWPORT_SIZE_AND_ZOOM,
} from "./camera/controls";
import { startGameLoop } from "./game/loop";
import { setupCanvasInteraction } from "./game/interaction";

import { generateWitches, generateGrid, type Position } from "../core";

export function init() {
  const initialPosition: Position = {
    x: Math.round(Math.random() * 94) + 3,
    y: Math.round(Math.random() * 94) + 3,
  } as const;

  const state: State = {
    game: {
      grid: generateGrid(),
      cat: {
        x: initialPosition.x,
        y: initialPosition.y,
        skin: "🐈‍⬛",
        actions: 5,
        availablePositions: new Set(),
      },
      witches: generateWitches(initialPosition.x, initialPosition.y),
    },
    view: {
      canvas: document.getElementById("canvas") as HTMLCanvasElement,
      camera: {
        x: initialPosition.x - Math.floor(DEFAULT_VIEWPORT_SIZE_AND_ZOOM / 2),
        y: initialPosition.y - Math.floor(DEFAULT_VIEWPORT_SIZE_AND_ZOOM / 2),
        z: DEFAULT_VIEWPORT_SIZE_AND_ZOOM,
      },
    },
  };

  setupPanelToggle();
  setupCanvasResize(state);
  setupControlButtons(state);
  setupCanvasInteraction(state);
  initializeCameraControls(state);
  startGameLoop(state, runFPS());
}
