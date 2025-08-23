import { expect, test } from "vitest";
import { generateGrid } from "./generate";

test("when generating a 100x100 grid, it has exactly 100 rows", () => {
  const grid = generateGrid();

  expect(grid.length === 100).toBe(true);
});

test("when generating a 100x100 grid, it has exactly 100 columns", () => {
  const grid = generateGrid();

  expect(grid.every((row) => row.length === 100)).toBe(true);
});

test("when generating a 20x20 grid, it has exactly 20 rows", () => {
  const grid = generateGrid({ size: 20 });
  expect(grid.length === 20).toBe(true);
  expect(grid.every((row) => row.length === 20)).toBe(true);
});

test("when accessing any position in 100x100 grid, it returns a valid tile", () => {
  const grid = generateGrid();

  const tile = grid[50][50];

  expect(tile).toBeDefined();
});

test("when accessing different positions in grid, they return different tiles", () => {
  const grid = generateGrid();

  const tile1 = grid[10][20];
  const tile2 = grid[30][40];

  expect(tile1).not.toStrictEqual(tile2);
});
