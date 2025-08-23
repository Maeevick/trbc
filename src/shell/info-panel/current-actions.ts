import { State } from "../..";

export function updateActionsInfo(state: State) {
  const actionsElement = document.getElementById(
    "action",
  ) as HTMLParagraphElement;
  actionsElement.innerText = `Remaining Actions: ${state.game.cat.actions}`;
}
