import { expect, test } from "vitest";
import {
  isOutOfGridBounds,
  isAlreadyOccupied,
  calculateMovementCost,
} from "./pathfinding";
import { GameState, TheRebelBlackCat, Witch } from "../state";
import { generateGrid } from "../grid/generate";

function createTestGameState(
  catPosition: { x: number; y: number },
  witches: Witch[] = [],
): GameState {
  const cat: TheRebelBlackCat = {
    x: catPosition.x,
    y: catPosition.y,
    skin: "🐈‍⬛",
    actions: 5,
    availablePositions: new Set(),
  };

  return {
    grid: generateGrid(),
    cat,
    witches,
  };
}

test("when checking position within grid bounds, it returns false", () => {
  const result = isOutOfGridBounds(50, 50);

  expect(result).toBe(false);
});

test("when checking position at grid start boundary, it returns false", () => {
  const result = isOutOfGridBounds(0, 0);

  expect(result).toBe(false);
});

test("when checking position at grid end boundary, it returns false", () => {
  const result = isOutOfGridBounds(99, 99);

  expect(result).toBe(false);
});

test("when checking position below grid start, it returns true", () => {
  const result = isOutOfGridBounds(-1, 50);

  expect(result).toBe(true);
});

test("when checking position above grid end, it returns true", () => {
  const result = isOutOfGridBounds(100, 50);

  expect(result).toBe(true);
});

test("when checking position with negative y coordinate, it returns true", () => {
  const result = isOutOfGridBounds(50, -1);

  expect(result).toBe(true);
});

test("when checking position with y coordinate at boundary, it returns true", () => {
  const result = isOutOfGridBounds(50, 100);

  expect(result).toBe(true);
});

test("when checking position with both coordinates out of bounds, it returns true", () => {
  const result = isOutOfGridBounds(-5, 105);

  expect(result).toBe(true);
});

test("when checking empty witches array, it returns false", () => {
  const witches: Witch[] = [];
  const result = isAlreadyOccupied(witches, 50, 50);

  expect(result).toBe(false);
});

test("when checking position occupied by witch, it returns true", () => {
  const witches: Witch[] = [{ x: 50, y: 50, skin: "🧙" }];
  const result = isAlreadyOccupied(witches, 50, 50);

  expect(result).toBe(true);
});

test("when checking position not occupied by witch, it returns false", () => {
  const witches: Witch[] = [{ x: 50, y: 50, skin: "🧙" }];
  const result = isAlreadyOccupied(witches, 51, 50);

  expect(result).toBe(false);
});

test("when checking position with multiple witches, one occupying position, it returns true", () => {
  const witches: Witch[] = [
    { x: 49, y: 50, skin: "🧙‍♀️" },
    { x: 50, y: 50, skin: "🧙" },
    { x: 51, y: 50, skin: "🧙‍♀️" },
  ];
  const result = isAlreadyOccupied(witches, 50, 50);

  expect(result).toBe(true);
});

test("when checking position with multiple witches, none occupying position, it returns false", () => {
  const witches: Witch[] = [
    { x: 49, y: 50, skin: "🧙‍♀️" },
    { x: 51, y: 50, skin: "🧙" },
    { x: 50, y: 51, skin: "🧙‍♀️" },
  ];
  const result = isAlreadyOccupied(witches, 50, 50);

  expect(result).toBe(false);
});

test("when calculating movement cost to adjacent position, it returns 1", () => {
  const gameState = createTestGameState({ x: 50, y: 50 });
  const cost = calculateMovementCost(
    gameState,
    { x: 50, y: 50 },
    { x: 51, y: 50 },
  );

  expect(cost).toBe(1);
});

test("when calculating movement cost to same position, it returns 0", () => {
  const gameState = createTestGameState({ x: 50, y: 50 });
  const cost = calculateMovementCost(
    gameState,
    { x: 50, y: 50 },
    { x: 50, y: 50 },
  );

  expect(cost).toBe(0);
});

test("when calculating movement cost to diagonal position, it returns Manhattan distance", () => {
  const gameState = createTestGameState({ x: 50, y: 50 });
  const cost = calculateMovementCost(
    gameState,
    { x: 50, y: 50 },
    { x: 52, y: 52 },
  );

  expect(cost).toBe(4);
});

test("when calculating movement cost with witch blocking direct path, it returns pathfinding cost", () => {
  const witches: Witch[] = [{ x: 51, y: 50, skin: "🧙" }];
  const gameState = createTestGameState({ x: 50, y: 50 }, witches);

  const cost = calculateMovementCost(
    gameState,
    { x: 50, y: 50 },
    { x: 52, y: 50 },
  );

  expect(cost).toBe(4);
});

test("when calculating movement cost to unreachable position, it returns null", () => {
  const witches: Witch[] = [
    { x: 49, y: 50, skin: "🧙" },
    { x: 51, y: 50, skin: "🧙" },
    { x: 50, y: 49, skin: "🧙" },
    { x: 50, y: 51, skin: "🧙" },
  ];
  const gameState = createTestGameState({ x: 50, y: 50 }, witches);

  const cost = calculateMovementCost(
    gameState,
    { x: 50, y: 50 },
    { x: 48, y: 50 },
  );

  expect(cost).toBe(null);
});

test("when calculating movement cost to out of bounds position, it returns null", () => {
  const gameState = createTestGameState({ x: 50, y: 50 });
  const cost = calculateMovementCost(
    gameState,
    { x: 50, y: 50 },
    { x: -1, y: 50 },
  );

  expect(cost).toBe(null);
});

test("when calculating movement cost around multiple witches, it finds optimal path", () => {
  const witches: Witch[] = [
    { x: 51, y: 50, skin: "🧙" },
    { x: 52, y: 51, skin: "🧙‍♀️" },
  ];
  const gameState = createTestGameState({ x: 50, y: 50 }, witches);

  const cost = calculateMovementCost(
    gameState,
    { x: 50, y: 50 },
    { x: 53, y: 50 },
  );

  expect(cost).toBe(5);
});
