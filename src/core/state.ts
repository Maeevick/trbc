import { type Grid, type Tile } from "./grid/generate";

export type Position = Tile;

export type TheRebelBlackCat = Position & {
  skin: "🐈‍⬛";
  actions: number;
  availablePositions: Set<string>;
};

export type Witch = Position & {
  skin: "🧙‍♀️" | "🧙";
};

export type GameState = {
  grid: Grid;
  cat: TheRebelBlackCat;
  witches: Witch[];
};
