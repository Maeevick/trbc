import { GameState } from "../state";
import { selectCat } from "./selection";
import { calculateMovementCost } from "./pathfinding";

export function moveCat(
  gameState: GameState,
  targetX: number,
  targetY: number,
): boolean {
  const targetKey = `${targetX},${targetY}`;

  if (!gameState.cat.availablePositions.has(targetKey)) {
    return false;
  }

  const movementCost = calculateMovementCost(
    gameState,
    { x: gameState.cat.x, y: gameState.cat.y },
    { x: targetX, y: targetY },
  );

  if (movementCost === null) {
    return false;
  }

  gameState.cat.x = targetX;
  gameState.cat.y = targetY;

  gameState.cat.actions -= movementCost;

  selectCat(gameState);

  return true;
}
