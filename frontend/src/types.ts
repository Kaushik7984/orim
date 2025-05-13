import { fabric } from "fabric"; 
import { FabricJSEditor } from "fabricjs-react";
import { User as FirebaseUser } from "firebase/auth";

// Extend Firebase user type
export interface AppUser extends FirebaseUser {
  displayName: string | null;
}

export interface BoardContent {
  path: string;
  canvasData: fabric.ICanvasOptions;
}

// Board model from backend
export interface Board {
  _id: string;
  id: string;
  title: string;
  isPublic: boolean;
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
  canvasData?: fabric.ICanvasOptions;
  imageUrl?: string;
  isStarred?: boolean;
}

// DTO for creating a board
export interface CreateBoardDto {
  title: string;
  description?: string;
  imageUrl?: string;
  isPublic: boolean;
  ownerId: string;
}

// Props for sidebar tools using Fabric
export interface FabricSidebarProps {
  editor: FabricJSEditor | undefined;
}

export interface FabricHeaderProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  // resetZoom: () => void;
}

// The complete BoardContext type
export interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;

  createBoard: (
    title: string,
    description?: string,
    isPublic?: boolean
  ) => Promise<Board>;

  updateBoard: (id: string, data: Partial<Board>) => Promise<Board>;
  deleteBoard: (id: string) => Promise<void>;
  loadBoards: () => Promise<void>;
  loadStarredBoards: () => Promise<void>;
  loadBoard: (id: string) => Promise<void>;
  toggleStarBoard: (id: string) => Promise<Board>;
  // updateCanvasData: (
  //   id: string,
  //   canvasData: fabric.ICanvasOptions
  // ) => Promise<Board>;

  setCurrentBoard: (board: Board | null) => void;

  boardId: string | undefined;
  setBoardId: (id: string | undefined) => void;

  boardName: string;
  setBoardName: (name: string) => void;

  editor?: FabricJSEditor;
  setEditor: (editor: FabricJSEditor | undefined) => void;

  user?: AppUser;

  path: string;
  setPath: (path: string) => void;

  username: string;
  setUsername: (username: string) => void;

  // joinBoard: (boardId: string) => Promise<void>;
  newJoin: string;
  setNewJoin: (username: string) => void;

  // Drawing tools
  addCircle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addStraightLine: () => void;
  addText: () => void;
  addPolygon: () => void;
  addTextbox: (color: string) => void;
  addPen: (color?: string, thickness?: number) => void;
  addHighlighter: (color?: string, thickness?: number) => void;
  addColoredPen: (color: string, thickness?: number) => void;
  addEraser: () => void;
  disableDrawing: () => void;

  // Zoom & Pan
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  enablePanMode: () => void;
  disablePanMode: () => void;
  isPanning: boolean;
}
