export function updatePositionInfo(x: number, y: number) {
  const positionElement = document.getElementById(
    "position",
  ) as HTMLParagraphElement;
  positionElement.innerText = `Current Position: ${x}:${y}`;
}
