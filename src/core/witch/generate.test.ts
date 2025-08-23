import { expect, test } from "vitest";
import { generateWitches } from "./generate";
import { Witch } from "../state";

function verifyDistanceCatToWitch(catX: number, catY: number) {
  return function (witch: Witch) {
    const distance = Math.abs(witch.x - catX) + Math.abs(witch.y - catY);

    expect(distance).toBeGreaterThanOrEqual(2);
    expect(distance).toBeLessThanOrEqual(3);
  };
}

function veirfyInBoundsPositionForWitch() {
  return function (witch: Witch) {
    expect(witch.x).toBeGreaterThanOrEqual(0);
    expect(witch.x).toBeLessThan(100);
    expect(witch.y).toBeGreaterThanOrEqual(0);
    expect(witch.y).toBeLessThan(100);
  };
}

test("when generating default witches, it creates exactly 2 witches", () => {
  const witches = generateWitches(50, 50);

  expect(witches.length).toBe(2);
});

test("when generating custom number of witches, it creates that many", () => {
  const witches = generateWitches(50, 50, 3);

  expect(witches.length).toBe(3);
});

test("when generating 0 witches, it returns empty array", () => {
  const witches = generateWitches(50, 50, 0);

  expect(witches.length).toBe(0);
});

test("when generating witches, each has valid position coordinates", () => {
  const witches = generateWitches(50, 50, 5);

  witches.forEach(veirfyInBoundsPositionForWitch());
});

test("when generating witches, all are within Manhattan distance 2-3 from cat", () => {
  const catX = 50;
  const catY = 50;
  const witches = generateWitches(catX, catY, 10);

  witches.forEach(verifyDistanceCatToWitch(catX, catY));
});

test("when generating witches, none are at cat position", () => {
  const catX = 50;
  const catY = 50;
  const witches = generateWitches(catX, catY, 10);

  witches.forEach((witch) => {
    expect(witch.x !== catX || witch.y !== catY).toBe(true);
  });
});

test("when generating witches, no two witches occupy same position", () => {
  const witches = generateWitches(50, 50, 8);
  const positions = new Set();

  witches.forEach((witch) => {
    const positionKey = `${witch.x},${witch.y}`;
    expect(positions.has(positionKey)).toBe(false);
    positions.add(positionKey);
  });
});

test("when generating witches at grid edge, all positions are within bounds", () => {
  const witches = generateWitches(2, 2, 5);

  witches.forEach((witch) => {
    expect(witch.x).toBeGreaterThanOrEqual(0);
    expect(witch.x).toBeLessThan(100);
    expect(witch.y).toBeGreaterThanOrEqual(0);
    expect(witch.y).toBeLessThan(100);
  });
});

test("when generating witches near grid boundary, all positions are within bounds", () => {
  const witches = generateWitches(97, 97, 5);

  witches.forEach((witch) => {
    expect(witch.x).toBeGreaterThanOrEqual(0);
    expect(witch.x).toBeLessThan(100);
    expect(witch.y).toBeGreaterThanOrEqual(0);
    expect(witch.y).toBeLessThan(100);
  });
});

test("when generating single witch, it respects distance constraints", () => {
  const catX = 50;
  const catY = 50;
  const witches = generateWitches(catX, catY, 1);

  expect(witches.length).toBe(1);
  verifyDistanceCatToWitch(catX, catY)(witches[0]);
});

test("when generating witches with cat at corner, respects distance and bounds", () => {
  const catX = 1;
  const catY = 1;
  const witches = generateWitches(catX, catY, 3);

  witches.forEach((witch) => {
    expect(witch.x).toBeGreaterThanOrEqual(0);
    expect(witch.x).toBeLessThan(100);
    expect(witch.y).toBeGreaterThanOrEqual(0);
    expect(witch.y).toBeLessThan(100);

    const distance = Math.abs(witch.x - catX) + Math.abs(witch.y - catY);
    expect(distance).toBeGreaterThanOrEqual(2);
    expect(distance).toBeLessThanOrEqual(3);
  });
});

test("when generating many witches, algorithm doesn't get stuck", () => {
  const catX = 50;
  const catY = 50;

  const witches = generateWitches(catX, catY, 12);

  expect(witches.length).toBe(12);

  witches.forEach((witch) => {
    const distance = Math.abs(witch.x - catX) + Math.abs(witch.y - catY);
    expect(distance).toBeGreaterThanOrEqual(2);
    expect(distance).toBeLessThanOrEqual(3);
  });

  const positions = new Set(witches.map((w) => `${w.x},${w.y}`));
  expect(positions.size).toBe(witches.length);
});
