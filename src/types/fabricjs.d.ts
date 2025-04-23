import { fabric } from "fabric";

export interface ExtendedCanvas extends fabric.Canvas {
  isDragging: boolean;
  lastPosX: number;
  lastPosY: number;
}
