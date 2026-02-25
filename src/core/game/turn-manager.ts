import { GameState } from "../state";
import { deselectCat } from "../cat/selection";
import { DEFAULT_CAT_ACTIONS } from "../cat/config";
import { isCatAdjacentToAnyWitch } from "./pathfinding";

export function startCatTurn(gameState: GameState) {
  gameState.turnPhase = "cat";
  gameState.cat.actions = DEFAULT_CAT_ACTIONS;
  deselectCat(gameState);
}

export function endCatTurn(gameState: GameState) {
  if (gameState.turnPhase !== "cat") return;

  if (isCatAdjacentToAnyWitch(gameState)) {
    gameState.isCaught = true;
    return;
  }

  if (gameState.cat.lives <= 0) {
    gameState.isGameOver = true;
    return;
  }

  gameState.turnPhase = "witch";
  deselectCat(gameState);
}

export function endWitchTurn(gameState: GameState) {
  if (gameState.turnPhase !== "witch") return;

  gameState.turnNumber += 1;
  startCatTurn(gameState);
}

export function isCatOutOfActions(gameState: GameState): boolean {
  return gameState.cat.actions <= 0;
}

export function canEndTurn(gameState: GameState): boolean {
  return gameState.turnPhase === "cat" && !gameState.isGameOver && !gameState.isCaught;
}
