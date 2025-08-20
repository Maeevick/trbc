export function updateZoomReminder(viewportSize: number) {
  const zoomElement = document.getElementById("zoom") as HTMLDivElement;

  zoomElement.innerText = `Zoom: ${viewportSize}x${viewportSize} (${
    viewportSize * viewportSize
  } tiles)`;
}
