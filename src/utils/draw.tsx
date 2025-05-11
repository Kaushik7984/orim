import BoardContext from "@/context/BoardContext/BoardContext";
import { Pen } from "@/svgs/index.svg";
import { BoardContextType } from "@/types";
import { useContext } from "react";

export const PenIcon = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addPen = context?.addPen;

  return (
    <Pen className="w-[27px] h-[27px]" onClick={() => addPen && addPen()} />
  );
};
