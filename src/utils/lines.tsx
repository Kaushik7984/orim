import React, { FC, useContext } from "react";
import { Straight_Line } from "@/svgs/index.svg";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import NearMeIcon from "@mui/icons-material/NearMe";
import BoardContext from "@/context/BoardContext/BoardContext";
import { BoardContextType } from "@/types";

export const StraightLineIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addStraightLine = context?.addStraightLine;

  return (
    <Straight_Line
      onClick={() => addStraightLine && addStraightLine()}
      className='w-full h-full'
    />
  );
};

export const StraightArrowIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addStraightLine = context?.addStraightLine;

  return <NorthEastIcon onClick={() => addStraightLine && addStraightLine()} />;
};

export const CurvedLineIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addStraightLine = context?.addStraightLine;

  return <TurnRightIcon onClick={() => addStraightLine && addStraightLine()} />;
};

export const DirectionalLineIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addStraightLine = context?.addStraightLine;

  return <NearMeIcon onClick={() => addStraightLine && addStraightLine()} />;
};
