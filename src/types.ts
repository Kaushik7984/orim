import { FabricJSEditor } from "fabricjs-react";
import React from "react";
import { IEvent } from "fabric/fabric-impl";

export interface FabricSidebarProps {
  editor: FabricJSEditor | undefined;
}

export type Board = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardContextType = {
  board: Board | undefined;
  setBoard: React.Dispatch<React.SetStateAction<Board | undefined>>;
  boardId: string | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | undefined>>;
  boardName: string;
  setBoardName: React.Dispatch<React.SetStateAction<string>>;
  editor: FabricJSEditor | undefined;
  setEditor: React.Dispatch<React.SetStateAction<FabricJSEditor | undefined>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  newJoin: string;
  setNewJoin: React.Dispatch<React.SetStateAction<string>>;
  joinBoard: () => Promise<void>;
  createBoard: () => Promise<void>;
  handleCanvasModified: (event: IEvent) => void;

  path: any;
  setPath: React.Dispatch<React.SetStateAction<any>>;
  username: string | undefined;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  addCircle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addStraightLine: () => void;
  addText: () => void;
  addPolygon: () => void;
  addTextbox: (color: string) => void;
  addPen: () => void;
};

export type User = {
  username: string;
  signalData: any;
};
