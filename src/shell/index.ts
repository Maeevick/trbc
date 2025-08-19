import { generateGrid } from "../core";

export function init() {
  sayHello();
  setupPanelToggle();
  setupCanvasResize();
  renderTenBySixteenViewport();
}

function sayHello() {
  const hello = document.getElementById("hello") as HTMLParagraphElement;
  hello.innerText = "Hello, js13k!";
}

function setupPanelToggle() {
  const toggle = document.querySelector(".menu-toggle") as HTMLButtonElement;
  const panel = document.querySelector(".info-panel") as HTMLElement;

  toggle.addEventListener("touchend", (e) => {
    e.preventDefault();
    panel.classList.toggle("expanded");
  });

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    panel.classList.toggle("expanded");
  });
}

function setupCanvasResize() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

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

  const cameraX = 0;
  const cameraY = 84;

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
