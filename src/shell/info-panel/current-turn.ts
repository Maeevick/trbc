import { type State } from "../..";

export function updateCurrentTurn(state: State) {
  const turnElement = document.getElementById("current-turn") as HTMLParagraphElement;
  turnElement.innerText = `Current Turn: ${state.game.turnNumber + 1}`;
}