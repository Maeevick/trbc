import { type Grid, type Tile } from "./grid";

export type Position = Tile;

export type GameState = {
  grid: Grid;
  cat: Position;
};
