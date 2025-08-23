import { expect, test } from "vitest";
import { moveCat } from "./move";
import { GameState, TheRebelBlackCat } from "../state";
import { generateGrid } from "../grid/generate";

function createTestGameState(
  catPosition: { x: number; y: number },
  actions: number = 5,
): GameState {
  const cat: TheRebelBlackCat = {
    x: catPosition.x,
    y: catPosition.y,
    skin: "🐈‍⬛",
    actions,
    availablePositions: new Set(),
  };

  return {
    grid: generateGrid(),
    cat,
    witches: [],
  };
}

test("when moving cat to unavailable position, it returns false", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 3);

  const result = moveCat(gameState, 52, 50);

  expect(result).toBe(false);
  expect(gameState.cat.x).toBe(50);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});

test("when moving cat to available adjacent position, it moves successfully", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 3);
  gameState.cat.availablePositions.add("51,50");

  const result = moveCat(gameState, 51, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(51);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(2);
});

test("when moving cat, it deducts correct Manhattan distance from actions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 5);
  gameState.cat.availablePositions.add("52,51");

  const result = moveCat(gameState, 52, 51);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(51);
  expect(gameState.cat.actions).toBe(2);
});

test("when moving cat with exact actions needed, it uses all actions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 2);
  gameState.cat.availablePositions.add("52,50");

  const result = moveCat(gameState, 52, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(0);
});

test("when moving cat, it updates available positions based on new location", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 3);
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.cat.availablePositions.has("50,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("52,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("51,49")).toBe(true);
  expect(gameState.cat.availablePositions.has("51,51")).toBe(true);
});

test("when moving cat with witch blocking new available positions, it excludes witch positions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 3);
  gameState.witches = [{ x: 52, y: 50, skin: "🧙" }];
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.cat.availablePositions.has("52,50")).toBe(false);
  expect(gameState.cat.availablePositions.has("50,50")).toBe(true);
});

test("when moving cat to diagonal position, it calculates correct distance", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 4);
  gameState.cat.availablePositions.add("49,49");

  const result = moveCat(gameState, 49, 49);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(49);
  expect(gameState.cat.y).toBe(49);
  expect(gameState.cat.actions).toBe(2);
});

test("when moving cat multiple times, actions accumulate correctly", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 5);

  gameState.cat.availablePositions.add("51,50");
  moveCat(gameState, 51, 50);

  moveCat(gameState, 52, 50);

  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});

test("when moving cat with 0 actions remaining, available positions should be empty", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 1);
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.cat.actions).toBe(0);
  expect(gameState.cat.availablePositions.size).toBe(0);
});

test("when moving cat near grid boundary, available positions respect bounds", () => {
  const gameState = createTestGameState({ x: 1, y: 1 }, 3);
  gameState.cat.availablePositions.add("0,1");

  moveCat(gameState, 0, 1);

  expect(gameState.cat.availablePositions.has("-1,1")).toBe(false);
  expect(gameState.cat.availablePositions.has("0,-1")).toBe(false);
  expect(gameState.cat.availablePositions.has("1,1")).toBe(true);
});

test("when moving cat with maximum distance move, it works correctly", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 5);
  gameState.cat.availablePositions.add("45,50");

  const result = moveCat(gameState, 45, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(45);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(0);
});

test("when moving cat preserves other game state properties", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 3);
  const originalWitches = [{ x: 30, y: 30, skin: "🧙" as const }];
  gameState.witches = originalWitches;
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.witches).toBe(originalWitches);
  expect(gameState.grid).toBeDefined();
});

test("when cat needs to go around witch, it calculates correct pathfinding cost", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 4);
  gameState.witches = [{ x: 51, y: 50, skin: "🧙" }];

  gameState.cat.availablePositions.add("52,50");

  const result = moveCat(gameState, 52, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(0);
});

test("when cat is completely blocked by witches, move should fail", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 3);
  gameState.witches = [
    { x: 49, y: 50, skin: "🧙" },
    { x: 51, y: 50, skin: "🧙" },
    { x: 50, y: 49, skin: "🧙" },
    { x: 50, y: 51, skin: "🧙" },
  ];

  gameState.cat.availablePositions.add("48,50");

  const result = moveCat(gameState, 48, 50);

  expect(result).toBe(false);
  expect(gameState.cat.x).toBe(50);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});

test("when witch blocks diagonal path, it uses correct pathfinding cost", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 6);
  gameState.witches = [{ x: 51, y: 51, skin: "🧙" }];

  gameState.cat.availablePositions.add("52,52");

  const result = moveCat(gameState, 52, 52);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(52);
  expect(gameState.cat.actions).toBe(2);
});

test("when multiple witches create maze, cat finds optimal path", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 8);
  gameState.witches = [
    { x: 51, y: 50, skin: "🧙" },
    { x: 52, y: 51, skin: "🧙" },
    { x: 51, y: 52, skin: "🧙" },
  ];

  gameState.cat.availablePositions.add("53,50");

  const result = moveCat(gameState, 53, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(53);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});
