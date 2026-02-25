import { type State } from "../..";
import { endCatTurn, executeWitchTurn, endWitchTurn, canEndTurn } from "../../core";
import { canUseUnluckBomb, useUnluckBomb } from "../../core/cat/bomb";

export function setupGameControls(state: State) {
  function handleEndTurn() {
    if (!canEndTurn(state.game)) {
      return;
    }

    endCatTurn(state.game);
    executeWitchTurn(state.game);
    endWitchTurn(state.game);
    updateGameControls(state);
  }

  function handleUnluckBomb() {
    if (useUnluckBomb(state.game)) {
      updateGameControls(state);
    }
  }

  function handleRestartFloor() {
    if (state.game.isCaught) {
      const initialPosition = {
        x: Math.round(Math.random() * 94) + 3,
        y: Math.round(Math.random() * 94) + 3,
      };

      state.game.grid = generateGrid();
      state.game.cat = generateCat(initialPosition);
      state.game.witches = generateWitches(initialPosition.x, initialPosition.y);
      state.game.turnPhase = "cat";
      state.game.turnNumber = 0;
      state.game.isCaught = false;
      
      state.view.camera.x = initialPosition.x - Math.floor(state.view.camera.z / 2);
      state.view.camera.y = initialPosition.y - Math.floor(state.view.camera.z / 2);
      
      updateGameControls(state);
    }
  }

  const endTurnButtons = ["end-turn", "mobile-end-turn"];
  endTurnButtons.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    button.addEventListener("click", handleEndTurn);
  });

  const unluckBombButtons = ["unluck-bomb", "mobile-unluck-bomb"];
  unluckBombButtons.forEach((id) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    button.addEventListener("click", handleUnluckBomb);
  });

  updateGameControls(state);

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'restart-floor') {
      handleRestartFloor();
    }
  });
}

export function updateGameControls(state: State) {
  const endTurnButtons = ["end-turn", "mobile-end-turn"];
  const unluckBombButtons = ["unluck-bomb", "mobile-unluck-bomb"];

  const canEnd = canEndTurn(state.game);
  const canUseBomb = canUseUnluckBomb(state.game);

  endTurnButtons.forEach(id => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.disabled = !canEnd;
    }
  });

  unluckBombButtons.forEach(id => {
    const button = document.getElementById(id) as HTMLButtonElement;
    if (button) {
      button.disabled = !canUseBomb;
    }
  });
}
