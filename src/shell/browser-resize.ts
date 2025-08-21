import { State } from "..";

export function setupCanvasResize(state: State) {
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
    state.view.canvas.width = size;
    state.view.canvas.height = size;

    state.view.canvas.style.display = "block";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}
