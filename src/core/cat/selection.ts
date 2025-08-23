import { GameState } from "..";

export function selectCat(gameState: GameState) {
  gameState.cat.availablePositions.clear();

  for (let dx = -gameState.cat.actions; dx <= gameState.cat.actions; dx++) {
    for (let dy = -gameState.cat.actions; dy <= gameState.cat.actions; dy++) {
      const distance = Math.abs(dx) + Math.abs(dy);

      if (distance > 0 && distance <= gameState.cat.actions) {
        const newX = gameState.cat.x + dx;
        const newY = gameState.cat.y + dy;

        if (newX >= 0 && newX < 100 && newY >= 0 && newY < 100) {
          const witchAtPosition = gameState.witches.find(
            (w) => w.x === newX && w.y === newY,
          );
          if (!witchAtPosition) {
            gameState.cat.availablePositions.add(`${newX},${newY}`);
          }
        }
      }
    }
  }
}

export function deselectCat(gameState: GameState) {
  gameState.cat.availablePositions.clear();
}
