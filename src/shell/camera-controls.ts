import { GRID_END, GRID_START } from "../core";
import { updateZoomReminder } from "./debug-panel/zoom-reminder";

const DEFAULT_VIEWPORT_SIZE = 7;
const DEFAULT_CAMERA_X = Math.round(Math.random() * 50) + 1;
const DEFAULT_CAMERA_Y = Math.round(Math.random() * 50) + 1;

export const ZOOM_IN_MAX = 3;
export const ZOOM_OUT_MAX = 100;
export const THRESHOLD_TILE_SIZE_MAX_ZOOM = 5;
export const THRESHOLD_TACTICAL_MODE = 16;

let cameraX = DEFAULT_CAMERA_X;
let cameraY = DEFAULT_CAMERA_Y;
let viewportSize = DEFAULT_VIEWPORT_SIZE;

function moveCamera(dx: number, dy: number, canvas: HTMLCanvasElement) {
  cameraX = Math.max(
    GRID_START,
    Math.min(GRID_END - viewportSize, cameraX + dx),
  );
  cameraY = Math.max(
    GRID_START,
    Math.min(GRID_END - viewportSize, cameraY + dy),
  );
  updateButtonStates(canvas);
}

function setCameraPosition(
  newX: number,
  newY: number,
  canvas: HTMLCanvasElement,
) {
  cameraX = Math.max(GRID_START, Math.min(GRID_END - viewportSize, newX));
  cameraY = Math.max(GRID_START, Math.min(GRID_END - viewportSize, newY));
  updateButtonStates(canvas);
}

function recenterCameraOnZoom(
  centerX: number,
  centerY: number,
  canvas: HTMLCanvasElement,
) {
  const newCameraX = centerX - Math.floor(viewportSize / 2);
  const newCameraY = centerY - Math.floor(viewportSize / 2);
  setCameraPosition(newCameraX, newCameraY, canvas);
}

function updateButtonStates(canvas: HTMLCanvasElement) {
  const panButtons = [
    {
      ids: ["pan-nw", "mobile-pan-nw"],
      canMove: cameraX > GRID_START && cameraY > GRID_START,
    },
    { ids: ["pan-n", "mobile-pan-n"], canMove: cameraY > GRID_START },
    {
      ids: ["pan-ne", "mobile-pan-ne"],
      canMove: cameraX < GRID_END - viewportSize && cameraY > GRID_START,
    },
    { ids: ["pan-w", "mobile-pan-w"], canMove: cameraX > GRID_START },
    {
      ids: ["pan-e", "mobile-pan-e"],
      canMove: cameraX < GRID_END - viewportSize,
    },
    {
      ids: ["pan-sw", "mobile-pan-sw"],
      canMove: cameraX > GRID_START && cameraY < GRID_END - viewportSize,
    },
    {
      ids: ["pan-s", "mobile-pan-s"],
      canMove: cameraY < GRID_END - viewportSize,
    },
    {
      ids: ["pan-se", "mobile-pan-se"],
      canMove:
        cameraX < GRID_END - viewportSize && cameraY < GRID_END - viewportSize,
    },
  ];

  panButtons.forEach(({ ids, canMove }) => {
    ids.forEach((id) => {
      const button = document.getElementById(id) as HTMLButtonElement;
      if (button) {
        button.disabled = !canMove;
      }
    });
  });

  const zoomInIds = ["zoom-in", "mobile-zoom-in"];
  const zoomOutIds = ["zoom-out", "mobile-zoom-out"];

  zoomInIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.disabled = viewportSize <= ZOOM_IN_MAX;
    }
  });

  zoomOutIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      const nextViewportSize = viewportSize + 2;
      const nextTileSize = canvas.width / nextViewportSize;
      button.disabled =
        nextViewportSize > ZOOM_OUT_MAX + 1 ||
        nextTileSize < THRESHOLD_TILE_SIZE_MAX_ZOOM;
    }
  });
}

export function setupControlButtons(canvas: HTMLCanvasElement) {
  const panButtons = [
    { ids: ["pan-nw", "mobile-pan-nw"], dx: -1, dy: -1 },
    { ids: ["pan-n", "mobile-pan-n"], dx: 0, dy: -1 },
    { ids: ["pan-ne", "mobile-pan-ne"], dx: 1, dy: -1 },
    { ids: ["pan-w", "mobile-pan-w"], dx: -1, dy: 0 },
    { ids: ["pan-e", "mobile-pan-e"], dx: 1, dy: 0 },
    { ids: ["pan-sw", "mobile-pan-sw"], dx: -1, dy: 1 },
    { ids: ["pan-s", "mobile-pan-s"], dx: 0, dy: 1 },
    { ids: ["pan-se", "mobile-pan-se"], dx: 1, dy: 1 },
  ];

  panButtons.forEach(({ ids, dx, dy }) => {
    ids.forEach((id) => {
      const button = document.getElementById(id) as HTMLButtonElement;
      if (button) {
        button.addEventListener("click", () => {
          moveCamera(dx, dy, canvas);
        });
      }
    });
  });

  const zoomInIds = ["zoom-in", "mobile-zoom-in"];
  const zoomOutIds = ["zoom-out", "mobile-zoom-out"];

  zoomInIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.addEventListener("click", () => {
        if (viewportSize > ZOOM_IN_MAX) {
          const centerX = cameraX + Math.floor(viewportSize / 2);
          const centerY = cameraY + Math.floor(viewportSize / 2);

          viewportSize = Math.max(ZOOM_IN_MAX, viewportSize - 2);
          recenterCameraOnZoom(centerX, centerY, canvas);
          updateZoomReminder(viewportSize);
        }
      });
    }
  });

  zoomOutIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.addEventListener("click", () => {
        if (viewportSize <= ZOOM_OUT_MAX) {
          const centerX = cameraX + Math.floor(viewportSize / 2);
          const centerY = cameraY + Math.floor(viewportSize / 2);

          viewportSize = Math.min(ZOOM_OUT_MAX, viewportSize + 2);
          recenterCameraOnZoom(centerX, centerY, canvas);
          updateZoomReminder(viewportSize);
        }
      });
    }
  });

  const centerIds = ["pan-center", "mobile-pan-center"];
  centerIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.addEventListener("click", () => {
        const idealCameraX = DEFAULT_CAMERA_X - Math.floor(viewportSize / 2);
        const idealCameraY = DEFAULT_CAMERA_Y - Math.floor(viewportSize / 2);
        setCameraPosition(idealCameraX, idealCameraY, canvas);
      });
    }
  });

  const zoomCenterIds = ["zoom-center", "mobile-zoom-center"];
  zoomCenterIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.addEventListener("click", () => {
        const centerX = cameraX + Math.floor(viewportSize / 2);
        const centerY = cameraY + Math.floor(viewportSize / 2);

        viewportSize = DEFAULT_VIEWPORT_SIZE;
        recenterCameraOnZoom(centerX, centerY, canvas);
        updateZoomReminder(viewportSize);
      });
    }
  });
}

export function initializeCameraControls(canvas: HTMLCanvasElement) {
  updateZoomReminder(viewportSize);
  updateButtonStates(canvas);
}

export function getCameraState() {
  return { cameraX, cameraY, viewportSize };
}
