export interface DrawingEvent {
  type: 'draw' | 'erase' | 'clear' | 'undo' | 'redo';
  data: {
    x: number;
    y: number;
    color?: string;
    size?: number;
    tool?: string;
  };
}

export interface JoinDrawingRoom {
  drawingId: string;
  userId: string;
}

export interface LeaveDrawingRoom {
  drawingId: string;
  userId: string;
}
