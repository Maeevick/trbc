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
import { setupGameControls } from "./game/controls";

import {
  generateWitches,
  generateGrid,
  type Position,
  CAT_ENTITY,
} from "../core";
import { generateCat } from "../core/cat/generate";

export function init() {
  const initialPosition: Position = {
    x: Math.round(Math.random() * 94) + 3,
    y: Math.round(Math.random() * 94) + 3,
  } as const;

  const state: State = {
    game: {
      grid: generateGrid(),
      cat: generateCat(initialPosition),
      witches: generateWitches(initialPosition.x, initialPosition.y),
      turnPhase: CAT_ENTITY,
      turnNumber: 0,
      isGameOver: false,
      isCaught: false,
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
  setupGameControls(state);
  initializeCameraControls(state);
  startGameLoop(state, runFPS());
}
