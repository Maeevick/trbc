import { type Grid, type Tile } from "./grid/generate";

export const CAT_ENTITY = "cat";
export const WITCH_ENTITY = "witch";

export type EntityType = typeof CAT_ENTITY | typeof WITCH_ENTITY;

export type Position = Tile;

export type TheRebelBlackCat = Position & {
  skin: "🐈‍⬛";
  actions: number;
  lives: number;
  availablePositions: Set<string>;
};

export type Witch = Position & {
  skin: "🧙‍♀️" | "🧙";
  actions: number;
  behavior: {
    status: "lazy" | "dreamy" | "aggressive" | "stunned";
    duration: number;
  };
};

export type GameState = {
  grid: Grid;
  cat: TheRebelBlackCat;
  witches: Witch[];
  turnPhase: EntityType;
  turnNumber: number;
  isGameOver: boolean;
  isCaught: boolean;
};
