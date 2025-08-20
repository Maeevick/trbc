import { generateGrid, GRID_END, GRID_START } from "../core";
import { type FPSRunner, runFPS } from "./debug-panel/fps-runner";
import { setupPanelToggle } from "./hud";
import {
  setupControlButtons,
  initializeCameraControls,
  getCameraState,
  THRESHOLD_TACTICAL_MODE,
  THRESHOLD_TILE_SIZE_MAX_ZOOM,
} from "./camera-controls";
import { updatePositionInfo } from "./info-panel";

export function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  setupPanelToggle();
  setupCanvasResize(canvas);
  setupControlButtons(canvas);
  initializeCameraControls(canvas);
  startGameLoop(canvas, runFPS());
}

function startGameLoop(canvas: HTMLCanvasElement, fpsRunner: FPSRunner) {
  const { cameraX, cameraY } = getCameraState();
  function gameLoop() {
    fpsRunner.updateFPS();
    renderViewport(canvas);
    updatePositionInfo(cameraX, cameraY);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function setupCanvasResize(canvas: HTMLCanvasElement) {
  function resizeCanvas() {
    const header = document.querySelector("header") as HTMLElement;
    const footer = document.querySelector("footer") as HTMLElement;
    const controlsPanel = document.querySelector(
      ".mobile-controls-panel",
    ) as HTMLElement;

    const headerHeight = header ? header.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    const controlsHeight = controlsPanel ? controlsPanel.offsetHeight : 0;

    const availableWidth = window.innerWidth - 64;
    const availableHeight =
      window.innerHeight - headerHeight - footerHeight - controlsHeight - 64;

    const size = Math.min(availableWidth, availableHeight, 600);
    canvas.width = size;
    canvas.height = size;

    canvas.style.display = "block";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function renderViewport(canvas: HTMLCanvasElement) {
  const { cameraX, cameraY, viewportSize } = getCameraState();
  const context = canvas.getContext("2d")!;

  const tileSize = canvas.width / viewportSize;

  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const showTileDetails = tileSize > THRESHOLD_TACTICAL_MODE;
  const showTacticalGrid = tileSize > THRESHOLD_TILE_SIZE_MAX_ZOOM;

  const grid = generateGrid();

  for (let x = GRID_START; x < viewportSize; x++) {
    for (let y = GRID_START; y < viewportSize; y++) {
      const gridX = cameraX + x;
      const gridY = cameraY + y;

      if (
        gridX < GRID_END &&
        gridY < GRID_END &&
        gridX >= GRID_START &&
        gridY >= GRID_START
      ) {
        const tile = grid[gridY][gridX];
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
