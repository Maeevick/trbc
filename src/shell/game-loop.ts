import { State } from "..";

import { type FPSRunner } from "./debug-panel/fps-runner";
import { updatePositionInfo } from "./info-panel";
import {
  THRESHOLD_TACTICAL_MODE,
  THRESHOLD_TILE_SIZE_MAX_ZOOM,
} from "./camera-controls";

import { GRID_END, GRID_START } from "../core";

export function startGameLoop(state: State, fpsRunner: FPSRunner) {
  function gameLoop() {
    fpsRunner.updateFPS();
    renderViewport(state);
    updatePositionInfo(state);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function renderViewport(state: State) {
  const context = state.view.canvas.getContext("2d")!;

  const tileSize = state.view.canvas.width / state.view.camera.z;

  context.fillStyle = "#000";
  context.fillRect(0, 0, state.view.canvas.width, state.view.canvas.height);

  const showTileDetails = tileSize > THRESHOLD_TACTICAL_MODE;
  const showTacticalGrid = tileSize > THRESHOLD_TILE_SIZE_MAX_ZOOM;

  for (let x = GRID_START; x < state.view.camera.z; x++) {
    for (let y = GRID_START; y < state.view.camera.z; y++) {
      const gridX = state.view.camera.x + x;
      const gridY = state.view.camera.y + y;

      if (
        gridX < GRID_END &&
        gridY < GRID_END &&
        gridX >= GRID_START &&
        gridY >= GRID_START
      ) {
        const tile = state.game.grid[gridY][gridX];
        const pixelX = x * tileSize;
        const pixelY = y * tileSize;

        if (showTacticalGrid) {
          context.strokeStyle = "#333";
          context.lineWidth = 1;
          context.strokeRect(pixelX, pixelY, tileSize, tileSize);
        }

        if (showTileDetails) {
          context.fillStyle = "#666";
          context.font = "8px Arial";
          context.fillText(`${tile.x},${tile.y}`, pixelX + 2, pixelY + 10);
        }
      }
    }
  }
}
