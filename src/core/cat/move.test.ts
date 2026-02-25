import { expect, test } from "vitest";
import { moveCat } from "./move";
import { createTestDefaultGameStateAtx50y50 } from "../createTestGameState";

test("when moving cat to unavailable position, it returns false", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 3,
  });

  const result = moveCat(gameState, 52, 50);

  expect(result).toBe(false);
  expect(gameState.cat.x).toBe(50);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});

test("when moving cat to available adjacent position, it moves successfully", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 3,
  });
  gameState.cat.availablePositions.add("51,50");

  const result = moveCat(gameState, 51, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(51);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(2);
});

test("when moving cat, it deducts correct Manhattan distance from actions", () => {
  const gameState = createTestDefaultGameStateAtx50y50();
  gameState.cat.availablePositions.add("52,51");

  const result = moveCat(gameState, 52, 51);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(51);
  expect(gameState.cat.actions).toBe(2);
});

test("when moving cat with exact actions needed, it uses all actions", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 2,
  });
  gameState.cat.availablePositions.add("52,50");

  const result = moveCat(gameState, 52, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(0);
});

test("when moving cat, it updates available positions based on new location", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 3,
  });
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.cat.availablePositions.has("50,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("52,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("51,49")).toBe(true);
  expect(gameState.cat.availablePositions.has("51,51")).toBe(true);
});

test("when moving cat with witch blocking new available positions, it excludes witch positions", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 3,
    witches: [{ x: 52, y: 50, skin: "🧙", actions: 0 }],
  });
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.cat.availablePositions.has("52,50")).toBe(false);
  expect(gameState.cat.availablePositions.has("50,50")).toBe(true);
});

test("when moving cat to diagonal position, it calculates correct distance", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 4,
  });
  gameState.cat.availablePositions.add("49,49");

  const result = moveCat(gameState, 49, 49);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(49);
  expect(gameState.cat.y).toBe(49);
  expect(gameState.cat.actions).toBe(2);
});

test("when moving cat multiple times, actions accumulate correctly", () => {
  const gameState = createTestDefaultGameStateAtx50y50();

  gameState.cat.availablePositions.add("51,50");
  moveCat(gameState, 51, 50);

  moveCat(gameState, 52, 50);

  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});

test("when moving cat with 0 actions remaining, available positions should be empty", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 1,
  });
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.cat.actions).toBe(0);
  expect(gameState.cat.availablePositions.size).toBe(0);
});

test("when moving cat near grid boundary, available positions respect bounds", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    catPosition: { x: 1, y: 1 },
    actions: 3,
  });
  gameState.cat.availablePositions.add("0,1");

  moveCat(gameState, 0, 1);

  expect(gameState.cat.availablePositions.has("-1,1")).toBe(false);
  expect(gameState.cat.availablePositions.has("0,-1")).toBe(false);
  expect(gameState.cat.availablePositions.has("1,1")).toBe(true);
});

test("when moving cat with maximum distance move, it works correctly", () => {
  const gameState = createTestDefaultGameStateAtx50y50();
  gameState.cat.availablePositions.add("45,50");

  const result = moveCat(gameState, 45, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(45);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(0);
});

test("when moving cat preserves other game state properties", () => {
  const originalWitches = [{ x: 30, y: 30, skin: "🧙" as const, actions: 0 }];
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 3,
    witches: originalWitches,
  });
  gameState.cat.availablePositions.add("51,50");

  moveCat(gameState, 51, 50);

  expect(gameState.witches).toBe(originalWitches);
  expect(gameState.grid).toBeDefined();
});

test("when cat needs to go around witch, it calculates correct pathfinding cost", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 4,
    witches: [{ x: 51, y: 50, skin: "🧙", actions: 0 }],
  });

  gameState.cat.availablePositions.add("52,50");

  const result = moveCat(gameState, 52, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(0);
});

test("when cat is completely blocked by witches, move should fail", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 3,
    witches: [
      { x: 49, y: 50, skin: "🧙", actions: 0 },
      { x: 51, y: 50, skin: "🧙", actions: 0 },
      { x: 50, y: 49, skin: "🧙", actions: 0 },
      { x: 50, y: 51, skin: "🧙", actions: 0 },
    ],
  });

  gameState.cat.availablePositions.add("48,50");

  const result = moveCat(gameState, 48, 50);

  expect(result).toBe(false);
  expect(gameState.cat.x).toBe(50);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});

test("when witch blocks diagonal path, it uses correct pathfinding cost", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 6,
    witches: [{ x: 51, y: 51, skin: "🧙", actions: 0 }],
  });

  gameState.cat.availablePositions.add("52,52");

  const result = moveCat(gameState, 52, 52);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(52);
  expect(gameState.cat.y).toBe(52);
  expect(gameState.cat.actions).toBe(2);
});

test("when multiple witches create maze, cat finds optimal path", () => {
  const gameState = createTestDefaultGameStateAtx50y50({
    actions: 8,
    witches: [
      { x: 51, y: 50, skin: "🧙", actions: 0 },
      { x: 52, y: 51, skin: "🧙", actions: 0 },
      { x: 51, y: 52, skin: "🧙", actions: 0 },
    ],
  });

  gameState.cat.availablePositions.add("53,50");

  const result = moveCat(gameState, 53, 50);

  expect(result).toBe(true);
  expect(gameState.cat.x).toBe(53);
  expect(gameState.cat.y).toBe(50);
  expect(gameState.cat.actions).toBe(3);
});
