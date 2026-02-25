import { type GameState, type Witch } from "../state";
import { DEFAULT_WITCH_ACTIONS } from "./config";
import {
  calculateMovementCost,
  isOutOfGridBounds,
  isAlreadyOccupied,
  isCatTile,
} from "../game/pathfinding";

const DIRECTIONS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

export function moveWitch(gameState: GameState, witch: Witch): void {
  if (witch.actions <= 0) return;

  const catPosition = { x: gameState.cat.x, y: gameState.cat.y };

  let bestMove = null;
  let bestCost = Infinity;

  for (const { dx, dy } of DIRECTIONS) {
    const newX = witch.x + dx;
    const newY = witch.y + dy;

    if (isOutOfGridBounds(newX, newY)) continue;

    const otherWitches = gameState.witches.filter((w) => w !== witch);
    if (isAlreadyOccupied(otherWitches, newX, newY)) continue;

    if (isCatTile(gameState.cat, { x: newX, y: newY })) continue;

    const tempGameState = {
      ...gameState,
      witches: gameState.witches.map((w) =>
        w === witch ? { ...w, x: newX, y: newY } : w
      ),
    };

    const costToCat = calculateMovementCost(
      tempGameState,
      { x: newX, y: newY },
      catPosition
    );

    if (costToCat !== null && costToCat < bestCost) {
      bestCost = costToCat;
      bestMove = { x: newX, y: newY };
    }
  }

  if (bestMove) {
    witch.x = bestMove.x;
    witch.y = bestMove.y;
    witch.actions -= 1;
  }
}

export function resetWitchActions(gameState: GameState): void {
  for (const witch of gameState.witches) {
    witch.actions = DEFAULT_WITCH_ACTIONS;
  }
}

export function executeWitchTurn(gameState: GameState): void {
  resetWitchActions(gameState);

  for (const witch of gameState.witches) {
    while (witch.actions > 0) {
      const prevX = witch.x;
      const prevY = witch.y;

      moveWitch(gameState, witch);

      if (witch.x === prevX && witch.y === prevY) {
        break;
      }
    }
  }
}
