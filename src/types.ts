import { FabricJSEditor } from "fabricjs-react";
import React from "react";
import { IEvent } from "fabric/fabric-impl";
import { User as FirebaseUser } from "firebase/auth";

export interface AppUser extends FirebaseUser {
  displayName: string | null;
}

export interface Board {
  _id: string;
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  canvasData?: any;
  imageUrl?: string;
}

export interface CreateBoardDto {
  title: string;
  description?: string;
  imageUrl?: string;
  isPublic: boolean;
  ownerId: string;
}

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
  updateBoard: (id: string, data: Partial<Board>) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  setCurrentBoard: (board: Board | null) => void;
  loadBoards: () => Promise<void>;
  loadBoard: (id: string) => Promise<void>;
  updateCanvasData: (id: string, canvasData: any) => Promise<void>;
  boardId?: string;
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
  joinBoard: () => Promise<void>;
  newJoin: string;
  setNewJoin: (username: string) => void;
  handleCanvasModified: (event: any) => void;
  addCircle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addStraightLine: () => void;
  addText: () => void;
  addPolygon: () => void;
  addTextbox: (color: string) => void;
  addPen: () => void;
}

export interface FabricSidebarProps {
  editor: FabricJSEditor | undefined;
}
