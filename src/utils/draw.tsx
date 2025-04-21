import BoardContext from "@/context/BoardContext/BoardContext";
import { Pen } from "@/svgs/index.svg";
import { useContext } from "react";

export const PenIcon = () => {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error(
      "BoardContext is null. Ensure the provider is set up correctly."
    );
  }

  const { addPen } = context;

  return <Pen className='w-[27px] h-[27px]' onClick={() => addPen()} />;
};
