import { GRID_END, GRID_START } from "../grid/generate";
import { GameState, Witch } from "../state";

type Position = { x: number; y: number };

const DIRECTIONS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

export function isOutOfGridBounds(x: number, y: number): boolean {
  return x < GRID_START || x >= GRID_END || y < GRID_START || y >= GRID_END;
}

export function isAlreadyOccupied(witches: Witch[], x: number, y: number) {
  return witches.some((w) => w.x === x && w.y === y);
}

export function calculateMovementCost(
  gameState: GameState,
  start: Position,
  target: Position,
): number | null {
  const path = findPathWithBFS(gameState, start, target);
  return path ? path.length - 1 : null;
}

function findPathWithBFS(
  gameState: GameState,
  start: Position,
  target: Position,
): Position[] | null {
  const queue: { pos: Position; path: Position[] }[] = [
    { pos: start, path: [start] },
  ];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    if (pos.x === target.x && pos.y === target.y) {
      return path;
    }

    for (const { dx, dy } of DIRECTIONS) {
      const newX = pos.x + dx;
      const newY = pos.y + dy;
      const key = `${newX},${newY}`;

      if (isOutOfGridBounds(newX, newY)) {
        continue;
      }

      if (isAlreadyVisited(visited, key)) {
        continue;
      }

      if (isAlreadyOccupied(gameState.witches, newX, newY)) {
        continue;
      }

      visited.add(key);
      queue.push({
        pos: { x: newX, y: newY },
        path: [...path, { x: newX, y: newY }],
      });
    }
  }
  return null;
}

function isAlreadyVisited(visited: Set<string>, key: string): boolean {
  return visited.has(key);
}
