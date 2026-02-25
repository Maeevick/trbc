import { type Position, type TheRebelBlackCat } from "../state";
import { DEFAULT_CAT_ACTIONS, DEFAULT_CAT_LIVES } from "./config";

export function generateCat({ x, y }: Position): TheRebelBlackCat {
  return {
    x: x,
    y: y,
    skin: "🐈‍⬛",
    actions: DEFAULT_CAT_ACTIONS,
    lives: DEFAULT_CAT_LIVES,
    availablePositions: new Set<string>(),
  };
}
