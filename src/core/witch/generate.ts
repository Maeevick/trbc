import { GRID_END, GRID_START, Witch } from "..";

const SKINS: ("🧙‍♀️" | "🧙")[] = ["🧙‍♀️", "🧙"];
const THRESHOLD_CLOSEST_MANATHAN_DISTANCE_POSSIBLE = 2;
const THRESHOLD_FAREST_MANATHAN_DISTANCE_POSSIBLE = 3;

export function generateWitches(
  catX: number,
  catY: number,
  witchesCount: number = 2,
): Witch[] {
  const witches: Witch[] = [];

  for (let i = 0; i < witchesCount; i++) {
    let witchX: number, witchY: number, distance: number;

    do {
      witchX = catX + Math.floor(Math.random() * 7) - 3;
      witchY = catY + Math.floor(Math.random() * 7) - 3;
      distance = Math.abs(witchX - catX) + Math.abs(witchY - catY);
    } while (
      distance < THRESHOLD_CLOSEST_MANATHAN_DISTANCE_POSSIBLE ||
      distance > THRESHOLD_FAREST_MANATHAN_DISTANCE_POSSIBLE ||
      witchX < GRID_START ||
      witchX >= GRID_END ||
      witchY < GRID_START ||
      witchY >= GRID_END ||
      witches.some((w) => w.x === witchX && w.y === witchY)
    );

    witches.push({
      x: witchX,
      y: witchY,
      skin: SKINS[Math.floor(Math.random() * SKINS.length)],
    });
  }

  return witches;
}
