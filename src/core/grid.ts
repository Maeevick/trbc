export const GRID_START = 0;
export const GRID_END = 100;

export type Tile = {
  x: number;
  y: number;
};

export type Grid = Tile[][];

export function generateGrid({ size } = { size: GRID_END }): Grid {
  const gridData: Tile[][] = [];

  for (let y = GRID_START; y < size; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < size; x++) {
      row[x] = { x, y };
    }
    gridData[y] = row;
  }

  return gridData;
}
