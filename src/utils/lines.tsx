import BoardContext from "@/context/BoardContext/BoardContext";
import { Straight_Line } from "@/svgs/index.svg";
import { BoardContextType } from "@/types";
import NearMeIcon from "@mui/icons-material/NearMe";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import { FC, useContext } from "react";

export const StraightLineIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addStraightLine = context?.addStraightLine;

  return (
    <Straight_Line
      onClick={() => addStraightLine && addStraightLine()}
      className="w-full h-full"
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
