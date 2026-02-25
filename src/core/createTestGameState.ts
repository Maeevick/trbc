import {
  type Witch,
  type GameState,
  type TheRebelBlackCat,
  CAT_ENTITY,
  type EntityType,
  type Position,
} from "./state";
import { generateGrid } from "./grid/generate";
import { DEFAULT_CAT_LIVES, DEFAULT_CAT_ACTIONS } from "./cat/config";

interface TestGameStateOptions {
  catPosition?: Position;
  actions?: number;
  lives?: number;
  witches?: Witch[];
  turnNumber?: number;
  turnPhase?: EntityType;
  isGameOver?: boolean;
}

export function createTestDefaultGameStateAtx50y50(
  options: TestGameStateOptions = {}
): GameState {
  const {
    catPosition = { x: 50, y: 50 },
    actions = DEFAULT_CAT_ACTIONS,
    lives = DEFAULT_CAT_LIVES,
    witches = [],
    turnNumber = 0,
    turnPhase = CAT_ENTITY,
    isGameOver = false,
  } = options;
  const cat: TheRebelBlackCat = {
    x: catPosition.x,
    y: catPosition.y,
    skin: "🐈‍⬛",
    actions,
    lives,
    availablePositions: new Set(),
  };

  return {
    grid: generateGrid(),
    cat,
    witches,
    turnNumber,
    turnPhase,
    isGameOver,
  };
}
