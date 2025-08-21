import { type State } from "..";
import { GRID_END, GRID_START } from "../core";
import { updateZoomReminder } from "./debug-panel/zoom-reminder";

export const DEFAULT_VIEWPORT_SIZE_AND_ZOOM = 7;
export const ZOOM_IN_MAX = 3;
export const ZOOM_OUT_MAX = 100;
export const THRESHOLD_TILE_SIZE_MAX_ZOOM = 5;
export const THRESHOLD_TACTICAL_MODE = 16;

function moveCamera(state: State, dx: number, dy: number) {
  state.view.camera.x = Math.max(
    GRID_START,
    Math.min(GRID_END - state.view.camera.z, state.view.camera.x + dx),
  );
  state.view.camera.y = Math.max(
    GRID_START,
    Math.min(GRID_END - state.view.camera.z, state.view.camera.y + dy),
  );
  updateButtonStates(state);
}

function setCameraPosition(state: State, newX: number, newY: number) {
  state.view.camera.x = Math.max(
    GRID_START,
    Math.min(GRID_END - state.view.camera.z, newX),
  );
  state.view.camera.y = Math.max(
    GRID_START,
    Math.min(GRID_END - state.view.camera.z, newY),
  );
  updateButtonStates(state);
}

function recenterCameraOnZoom(state: State, centerX: number, centerY: number) {
  const newCameraX = centerX - Math.floor(state.view.camera.z / 2);
  const newCameraY = centerY - Math.floor(state.view.camera.z / 2);
  setCameraPosition(state, newCameraX, newCameraY);
}

function updateButtonStates(state: State) {
  const panButtons = [
    {
      ids: ["pan-nw", "mobile-pan-nw"],
      canMove:
        state.view.camera.x > GRID_START && state.view.camera.y > GRID_START,
    },
    {
      ids: ["pan-n", "mobile-pan-n"],
      canMove: state.view.camera.y > GRID_START,
    },
    {
      ids: ["pan-ne", "mobile-pan-ne"],
      canMove:
        state.view.camera.x < GRID_END - state.view.camera.z &&
        state.view.camera.y > GRID_START,
    },
    {
      ids: ["pan-w", "mobile-pan-w"],
      canMove: state.view.camera.x > GRID_START,
    },
    {
      ids: ["pan-e", "mobile-pan-e"],
      canMove: state.view.camera.x < GRID_END - state.view.camera.z,
    },
    {
      ids: ["pan-sw", "mobile-pan-sw"],
      canMove:
        state.view.camera.x > GRID_START &&
        state.view.camera.y < GRID_END - state.view.camera.z,
    },
    {
      ids: ["pan-s", "mobile-pan-s"],
      canMove: state.view.camera.y < GRID_END - state.view.camera.z,
    },
    {
      ids: ["pan-se", "mobile-pan-se"],
      canMove:
        state.view.camera.x < GRID_END - state.view.camera.z &&
        state.view.camera.y < GRID_END - state.view.camera.z,
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
      button.disabled = state.view.camera.z <= ZOOM_IN_MAX;
    }
  });

  zoomOutIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      const nextViewportSizeAndZoom = state.view.camera.z + 2;
      const nextTileSize = state.view.canvas.width / nextViewportSizeAndZoom;
      button.disabled =
        nextViewportSizeAndZoom > ZOOM_OUT_MAX + 1 ||
        nextTileSize < THRESHOLD_TILE_SIZE_MAX_ZOOM;
    }
  });
}

export function setupControlButtons(state: State) {
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
          moveCamera(state, dx, dy);
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
        if (state.view.camera.z > ZOOM_IN_MAX) {
          const centerX =
            state.view.camera.x + Math.floor(state.view.camera.z / 2);
          const centerY =
            state.view.camera.y + Math.floor(state.view.camera.z / 2);

          state.view.camera.z = Math.max(ZOOM_IN_MAX, state.view.camera.z - 2);
          recenterCameraOnZoom(state, centerX, centerY);
          updateZoomReminder(state);
        }
      });
    }
  });

  zoomOutIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.addEventListener("click", () => {
        if (state.view.camera.z <= ZOOM_OUT_MAX) {
          const centerX =
            state.view.camera.x + Math.floor(state.view.camera.z / 2);
          const centerY =
            state.view.camera.y + Math.floor(state.view.camera.z / 2);

          state.view.camera.z = Math.min(ZOOM_OUT_MAX, state.view.camera.z + 2);
          recenterCameraOnZoom(state, centerX, centerY);
          updateZoomReminder(state);
        }
      });
    }
  });

  const centerIds = ["pan-center", "mobile-pan-center"];
  centerIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.addEventListener("click", () => {
        const idealCameraX =
          state.game.cat.x - Math.floor(state.view.camera.z / 2);
        const idealCameraY =
          state.game.cat.y - Math.floor(state.view.camera.z / 2);
        setCameraPosition(state, idealCameraX, idealCameraY);
      });
    }
  });

  const zoomCenterIds = ["zoom-center", "mobile-zoom-center"];
  zoomCenterIds.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.addEventListener("click", () => {
        const centerX =
          state.view.camera.x + Math.floor(state.view.camera.z / 2);
        const centerY =
          state.view.camera.y + Math.floor(state.view.camera.z / 2);

        state.view.camera.z = DEFAULT_VIEWPORT_SIZE_AND_ZOOM;
        recenterCameraOnZoom(state, centerX, centerY);
        updateZoomReminder(state);
      });
    }
  });
}

export function initializeCameraControls(state: State) {
  updateZoomReminder(state);
  updateButtonStates(state);
}
