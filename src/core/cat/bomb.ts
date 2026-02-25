import { GameState } from "../state";
import { isCatAdjacentToAnyWitch } from "../game/pathfinding";

export function canUseUnluckBomb(gameState: GameState): boolean {
  return gameState.turnPhase === "cat" && isCatAdjacentToAnyWitch(gameState) && gameState.cat.lives > 1;
}

export function useUnluckBomb(gameState: GameState): boolean {
  if (!canUseUnluckBomb(gameState)) {
    return false;
  }

  gameState.cat.lives -= 1;
  
  const catX = gameState.cat.x;
  const catY = gameState.cat.y;
  const stunRadius = 5;

  gameState.witches.forEach(witch => {
    const distance = Math.sqrt(
      Math.pow(witch.x - catX, 2) + Math.pow(witch.y - catY, 2)
    );
    
    if (distance <= stunRadius) {
      witch.behavior.status = "stunned";
      witch.behavior.duration = 3;
      witch.actions = 0;
    }
  });

  return true;
}