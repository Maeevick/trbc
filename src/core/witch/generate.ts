import { Witch } from "..";
import { isOutOfGridBounds, isAlreadyOccupied } from "../game/pathfinding";
import {
  SKINS,
  THRESHOLD_CLOSEST_MANATHAN_DISTANCE_POSSIBLE,
  THRESHOLD_FAREST_MANATHAN_DISTANCE_POSSIBLE,
  DEFAULT_WITCH_ACTIONS,
} from "./config";

export function generateWitches(
  catX: number,
  catY: number,
  witchesCount: number = 2
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
      isOutOfGridBounds(witchX, witchY) ||
      isAlreadyOccupied(witches, witchX, witchY)
    );

    witches.push({
      x: witchX,
      y: witchY,
      skin: SKINS[Math.floor(Math.random() * SKINS.length)],
      actions: DEFAULT_WITCH_ACTIONS,
    });
  }

  return witches;
}
