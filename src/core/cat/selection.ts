import { GameState } from "..";
import {
  calculateMovementCost,
  isAlreadyOccupied,
  isOutOfGridBounds,
} from "./pathfinding";

function isMovePossible(cost: number | null, available: number) {
  return cost !== null && cost <= available;
}

export function selectCat(gameState: GameState) {
  gameState.cat.availablePositions.clear();

  for (let dx = -gameState.cat.actions; dx <= gameState.cat.actions; dx++) {
    for (let dy = -gameState.cat.actions; dy <= gameState.cat.actions; dy++) {
      if (dx === 0 && dy === 0) continue;

      const newX = gameState.cat.x + dx;
      const newY = gameState.cat.y + dy;

      if (isOutOfGridBounds(newX, newY)) {
        continue;
      }

      if (isAlreadyOccupied(gameState.witches, newX, newY)) {
        continue;
      }

      if (
        isMovePossible(
          calculateMovementCost(
            gameState,
            { x: gameState.cat.x, y: gameState.cat.y },
            { x: newX, y: newY },
          ),
          gameState.cat.actions,
        )
      ) {
        gameState.cat.availablePositions.add(`${newX},${newY}`);
      }
    }
  }
}

export function deselectCat(gameState: GameState) {
  gameState.cat.availablePositions.clear();
}
