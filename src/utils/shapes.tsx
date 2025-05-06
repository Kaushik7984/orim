import React, { FC, useContext } from "react";
import BoardContext from "@/context/BoardContext/BoardContext";
import { BoardContextType } from "@/types";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CropDinIcon from "@mui/icons-material/CropDin";
import { CgShapeRhombus } from "react-icons/cg";

export const CircleIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addCircle = context?.addCircle;

  return <RadioButtonUncheckedIcon onClick={() => addCircle && addCircle()} />;
};

export const TriangleIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addTriangle = context?.addTriangle;

  return <ChangeHistoryIcon onClick={() => addTriangle && addTriangle()} />;
};

export const RectIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addRectangle = context?.addRectangle;

  return <CropDinIcon onClick={() => addRectangle && addRectangle()} />;
};

export const PolygonIcon: FC = () => {
  const context = useContext(BoardContext) as BoardContextType;
  const addPolygon = context?.addPolygon;

  return <CgShapeRhombus onClick={() => addPolygon && addPolygon()} />;
};
