import { createContext } from "react";
import { BoardContextType } from "@/types";

const BoardContext = createContext<BoardContextType | null>(null);

export default BoardContext;
