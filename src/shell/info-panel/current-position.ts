import { State } from "../..";

export function updatePositionInfo(state: State) {
  const positionElement = document.getElementById(
    "position",
  ) as HTMLParagraphElement;
  positionElement.innerText = `Current Position: ${state.game.cat.x}:${state.game.cat.y}`;
}
