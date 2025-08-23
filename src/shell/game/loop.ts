import { State } from "../..";

import { type FPSRunner } from "../debug-panel/fps-runner";
import { updatePositionInfo } from "../info-panel/current-position";
import {
  THRESHOLD_TACTICAL_MODE,
  THRESHOLD_TILE_SIZE_MAX_ZOOM,
} from "../camera/controls";

import { GRID_END, GRID_START } from "../../core";

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
          context.textAlign = "center";
          context.textBaseline = "top";
          context.fillText(
            `${tile.x}:${tile.y}`,
            pixelX + tileSize / 2,
            pixelY + 2,
          );
        }
      }
    }
  }

  const catScreenX = (state.game.cat.x - state.view.camera.x) * tileSize;
  const catScreenY = (state.game.cat.y - state.view.camera.y) * tileSize;

  if (
    catScreenX >= 0 &&
    catScreenX < state.view.canvas.width &&
    catScreenY >= 0 &&
    catScreenY < state.view.canvas.height
  ) {
    context.strokeStyle = "#ff8800";
    context.lineWidth = 2;
    context.strokeRect(catScreenX, catScreenY, tileSize, tileSize);

    context.fillStyle = "#fff";
    context.font = `${Math.floor(tileSize * 0.4)}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      state.game.cat.skin,
      catScreenX + tileSize / 2,
      catScreenY + tileSize / 2,
    );
  }

  state.game.witches.forEach((witch) => {
    const witchScreenX = (witch.x - state.view.camera.x) * tileSize;
    const witchScreenY = (witch.y - state.view.camera.y) * tileSize;

    if (
      witchScreenX >= 0 &&
      witchScreenX < state.view.canvas.width &&
      witchScreenY >= 0 &&
      witchScreenY < state.view.canvas.height
    ) {
      context.strokeStyle = "#ff4444";
      context.lineWidth = 2;
      context.strokeRect(witchScreenX, witchScreenY, tileSize, tileSize);

      context.fillStyle = "#fff";
      context.font = `${Math.floor(tileSize * 0.4)}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.fillText(
        witch.skin,
        witchScreenX + tileSize / 2,
        witchScreenY + tileSize / 2,
      );
    }
  });

  // Render highlighted tiles (available moves)
  state.game.cat.availablePositions.forEach((tileKey) => {
    const [x, y] = tileKey.split(",").map(Number);
    const highlightScreenX = (x - state.view.camera.x) * tileSize;
    const highlightScreenY = (y - state.view.camera.y) * tileSize;

    // Only render if visible in viewport
    if (
      highlightScreenX >= 0 &&
      highlightScreenX < state.view.canvas.width &&
      highlightScreenY >= 0 &&
      highlightScreenY < state.view.canvas.height
    ) {
      // Draw green highlight for available moves
      context.fillStyle = "rgba(0, 255, 0, 0.3)";
      context.fillRect(highlightScreenX, highlightScreenY, tileSize, tileSize);

      // Draw green border
      context.strokeStyle = "#00ff00";
      context.lineWidth = 2;
      context.strokeRect(
        highlightScreenX,
        highlightScreenY,
        tileSize,
        tileSize,
      );
    }
  });
}
