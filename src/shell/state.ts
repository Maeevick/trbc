import { Position } from "../core";

export type ViewState = {
  canvas: HTMLCanvasElement;
  camera: Position & { z: number };
};
