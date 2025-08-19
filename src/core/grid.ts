type Tile = {
  x: number;
  y: number;
};

type Grid = Tile[][];

export function generateGrid({ size } = { size: 100 }): Grid {
  const gridData: Tile[][] = [];

  for (let y = 0; y < size; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < size; x++) {
      row[x] = { x, y };
    }
    gridData[y] = row;
  }

  return gridData;
}
