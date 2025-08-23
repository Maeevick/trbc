import { expect, test } from "vitest";
import { selectCat, deselectCat } from "./selection";
import { GameState, generateGrid, TheRebelBlackCat } from "..";

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

test("when deselecting cat, it clears available positions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 });
  gameState.cat.availablePositions.add("49,50");
  gameState.cat.availablePositions.add("51,50");

  deselectCat(gameState);

  expect(gameState.cat.availablePositions.size).toBe(0);
});

test("when selecting cat with 1 action, it finds 4 adjacent positions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 1);

  selectCat(gameState);

  expect(gameState.cat.availablePositions.size).toBe(4);
  expect(gameState.cat.availablePositions.has("49,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("51,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("50,49")).toBe(true);
  expect(gameState.cat.availablePositions.has("50,51")).toBe(true);
});

test("when selecting cat with 2 actions, it finds all positions within Manhattan distance 2", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 2);

  selectCat(gameState);

  expect(gameState.cat.availablePositions.size).toBe(12);
  expect(gameState.cat.availablePositions.has("48,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("52,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("50,48")).toBe(true);
  expect(gameState.cat.availablePositions.has("50,52")).toBe(true);
  expect(gameState.cat.availablePositions.has("49,49")).toBe(true);
  expect(gameState.cat.availablePositions.has("51,51")).toBe(true);
});

test("when selecting cat at grid edge, it excludes out-of-bounds positions", () => {
  const gameState = createTestGameState({ x: 0, y: 0 }, 2);

  selectCat(gameState);

  expect(gameState.cat.availablePositions.has("-1,0")).toBe(false);
  expect(gameState.cat.availablePositions.has("0,-1")).toBe(false);
  expect(gameState.cat.availablePositions.has("-1,-1")).toBe(false);
  expect(gameState.cat.availablePositions.has("1,0")).toBe(true);
  expect(gameState.cat.availablePositions.has("0,1")).toBe(true);
});

test("when selecting cat near grid boundary, it excludes positions >= 100", () => {
  const gameState = createTestGameState({ x: 99, y: 99 }, 2);

  selectCat(gameState);

  expect(gameState.cat.availablePositions.has("100,99")).toBe(false);
  expect(gameState.cat.availablePositions.has("99,100")).toBe(false);
  expect(gameState.cat.availablePositions.has("100,100")).toBe(false);
  expect(gameState.cat.availablePositions.has("98,99")).toBe(true);
  expect(gameState.cat.availablePositions.has("99,98")).toBe(true);
});

test("when selecting cat with witch blocking position, it excludes witch position", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 2);
  gameState.witches = [
    { x: 51, y: 50, skin: "🧙‍♀️" },
    { x: 49, y: 51, skin: "🧙" },
  ];

  selectCat(gameState);

  expect(gameState.cat.availablePositions.has("51,50")).toBe(false);
  expect(gameState.cat.availablePositions.has("49,51")).toBe(false);
  expect(gameState.cat.availablePositions.has("49,50")).toBe(true);
  expect(gameState.cat.availablePositions.has("50,51")).toBe(true);
});

test("when selecting cat with 0 actions, it finds no available positions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 0);

  selectCat(gameState);

  expect(gameState.cat.availablePositions.size).toBe(0);
});

test("when selecting cat, it excludes cat's current position", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 3);

  selectCat(gameState);

  expect(gameState.cat.availablePositions.has("50,50")).toBe(false);
});

test("when selecting cat clears previous available positions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 1);
  gameState.cat.availablePositions.add("10,10");
  gameState.cat.availablePositions.add("20,20");

  selectCat(gameState);

  expect(gameState.cat.availablePositions.has("10,10")).toBe(false);
  expect(gameState.cat.availablePositions.has("20,20")).toBe(false);
  expect(gameState.cat.availablePositions.size).toBe(4);
});

test("when selecting cat with multiple witches, it excludes all witch positions", () => {
  const gameState = createTestGameState({ x: 50, y: 50 }, 1);
  gameState.witches = [
    { x: 49, y: 50, skin: "🧙" },
    { x: 51, y: 50, skin: "🧙‍♀️" },
    { x: 50, y: 49, skin: "🧙‍♀️" },
  ];

  selectCat(gameState);

  expect(gameState.cat.availablePositions.size).toBe(1);
  expect(gameState.cat.availablePositions.has("50,51")).toBe(true);
});
