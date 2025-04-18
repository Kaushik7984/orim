export interface DrawingContent {
  elements: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: Array<{ x: number; y: number }>;
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
  }>;
  viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
    zoom: number;
  };
}
