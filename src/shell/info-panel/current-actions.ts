import { State } from "../..";
import { DEFAULT_CAT_ACTIONS } from "../../core/cat/config";

export function updateActionsInfo(state: State) {
  const actionsElement = document.getElementById(
    "action",
  ) as HTMLParagraphElement;
  actionsElement.innerText = `Actions: ${state.game.cat.actions}/${DEFAULT_CAT_ACTIONS}`;
}
