import { State } from "../..";

export function updateZoomReminder(state: State) {
  const zoomElement = document.getElementById("zoom") as HTMLDivElement;

  zoomElement.innerText = `Zoom: ${state.view.camera.z}x${
    state.view.camera.z
  } (${state.view.camera.z * state.view.camera.z} tiles)`;
}
