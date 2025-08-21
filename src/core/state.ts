import { type Grid, type Tile } from "./grid";

export type Position = Tile;

export type TheRebelBlackCat = Position & { skin: "🐈‍⬛" };

export type Witch = Position & {
  skin: "🧙‍♀️" | "🧙";
};

export type GameState = {
  grid: Grid;
  cat: TheRebelBlackCat;
  witches: Witch[];
};
