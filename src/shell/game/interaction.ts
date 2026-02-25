import { type State } from "../..";
import { selectCat, deselectCat, moveCat } from "../../core";

export function setupCanvasInteraction(state: State) {
  const canvas = state.view.canvas;

  function handleCanvasClick(event: MouseEvent | TouchEvent) {
    if (state.game.isGameOver) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ("touches" in event) {
      const touch = event.touches[0] || event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    const tileSize = canvas.width / state.view.camera.z;
    const gridX = Math.floor(canvasX / tileSize) + state.view.camera.x;
    const gridY = Math.floor(canvasY / tileSize) + state.view.camera.y;

    if (gridX === state.game.cat.x && gridY === state.game.cat.y) {
      if (state.game.cat.availablePositions.size === 0) {
        selectCat(state.game);
      } else {
        deselectCat(state.game);
      }
      return;
    }
    if (state.game.cat.availablePositions.has(`${gridX},${gridY}`)) {
      moveCat(state.game, gridX, gridY);
      return;
    }
    deselectCat(state.game);
  }

  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    handleCanvasClick(e);
  });
}
