import { generateGrid } from "../core";
import { type FPSRunner, runFPS } from "./fps-runner";
import { setupPanelToggle } from "./hud";

let cameraX = 0;
let cameraY = 84;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

export function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  setupPanelToggle();
  setupCanvasResize(canvas);
  setupPanControls(canvas);
  startGameLoop(runFPS());
}

function startGameLoop(fpsRunner: FPSRunner) {
  function gameLoop() {
    fpsRunner.updateFPS();
    renderTenBySixteenViewport();
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function setupCanvasResize(canvas: HTMLCanvasElement) {
  function resizeCanvas() {
    const gameArea = document.querySelector(".game-area") as HTMLElement;
    const availableWidth = gameArea.clientWidth - 32;
    const availableHeight = gameArea.clientHeight - 32;

    const aspectRatio = 10 / 16;
    let canvasWidth, canvasHeight;

    if (availableWidth / availableHeight > aspectRatio) {
      canvasHeight = availableHeight;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      canvasWidth = availableWidth;
      canvasHeight = canvasWidth / aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function setupPanControls(canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;

    const sensitivity = 0.05;
    cameraX -= deltaX * sensitivity;
    cameraY -= deltaY * sensitivity;

    cameraX = Math.round(Math.max(0, Math.min(90, cameraX)));
    cameraY = Math.round(Math.max(0, Math.min(84, cameraY)));

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mouseleave", () => {
    isDragging = false;
  });
}

function renderTenBySixteenViewport() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;
  const grid = generateGrid();

  const viewportWidth = 10;
  const viewportHeight = 16;
  const tileWidth = canvas.width / viewportWidth;
  const tileHeight = canvas.height / viewportHeight;

  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < viewportWidth; x++) {
    for (let y = 0; y < viewportHeight; y++) {
      const gridX = cameraX + x;
      const gridY = cameraY + y;

      if (gridX < 100 && gridY < 100 && gridX >= 0 && gridY >= 0) {
        const tile = grid[gridY][gridX];
        const pixelX = x * tileWidth;
        const pixelY = y * tileHeight;

        context.strokeStyle = "#333";
        context.lineWidth = 1;
        context.strokeRect(pixelX, pixelY, tileWidth, tileHeight);

        context.fillStyle = "#666";
        context.font = "8px Arial";
        context.fillText(`${tile.x},${tile.y}`, pixelX + 2, pixelY + 10);
      }
    }
  }
}
