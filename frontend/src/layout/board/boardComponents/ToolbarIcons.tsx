import { useState } from "react";

import { Nunito } from "next/font/google";

import AddBoxIcon from "@mui/icons-material/AddBox";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InterestsOutlinedIcon from "@mui/icons-material/InterestsOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import { Divider } from "@mui/material";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import {
  Brush,
  Crop,
  LayoutPanelTop,
  MessageSquareText,
  MousePointer2,
  TrendingUpDown,
  Type,
  Upload,
} from "lucide-react";

import {
  Eraser,
  Highlighter,
  Lasso,
  Smart_Draw,
  Thickness,
} from "@/svgs/index.svg";

import { PenIcon } from "@/utils/draw";
import {
  CurvedLineIcon,
  DirectionalLineIcon,
  StraightArrowIcon,
  StraightLineIcon,
} from "@/utils/lines";
import {
  CircleIcon,
  PolygonIcon,
  RectIcon,
  TriangleIcon,
} from "@/utils/shapes";
import { HIGHLIGHTER_COLORS, PEN_COLORS, PEN_THICKNESS } from "@/utils/usePen";

const nunito = Nunito({
  subsets: ["latin-ext"],
  weight: ["300"],
});

const shapes = [
  {
    icon: <RectIcon />,
    name: "Rectangle",
  },
  {
    icon: <CircleIcon />,
    name: "Circle",
  },
  {
    icon: <TriangleIcon />,
    name: "Triangle",
  },
  {
    icon: <StraightLineIcon />,
    name: "Line",
  },
  {
    icon: <PolygonIcon />,
    name: "Polygon",
  },
  {
    icon: <ChatBubbleOutlineIcon />,
    name: "Speech bubble",
  },
  {
    icon: <FavoriteBorderIcon />,
    name: "Heart",
  },
  {
    icon: <StraightArrowIcon />,
    name: "Arrow",
  },
];

const lines = [
  {
    name: "Straight line",
    icon: <StraightLineIcon />,
  },
  {
    name: "Straight arrow",
    icon: <StraightArrowIcon />,
  },
  {
    name: "Curved line",
    icon: <CurvedLineIcon />,
  },
  {
    name: "directional line",
    icon: <DirectionalLineIcon />,
  },
];

const pens = [
  {
    name: "Pen",
    icon: <PenIcon />,
  },
  {
    name: "Highlighter",
    icon: <Highlighter className='w-[27px] h-[27px]' />,
  },
  // {
  //   name: "Smart draw",
  //   icon: <Smart_Draw className='w-[27px] h-[27px]' />,
  // },
  {
    name: "Eraser",
    icon: <Eraser className='w-[27px] h-[27px]' />,
  },
  {
    name: "Lasso",
    icon: <Lasso className='w-[27px] h-[27px]' />,
  },
];

const stickyNotes = [
  "#FFCCCB",
  "#FFB6C1",
  "#FFA07A",
  "#FF8C00",
  "#FFD700",
  "#FFFF00",
  "#ADFF2F",
  "#7FFF00",
  "#00FA9A",
  "#00CED1",
  "#87CEEB",
  "#6495ED",
  "#9370DB",
  "#8A2BE2",
  "#4B0082",
  "#800080",
];

const PenToolbar = ({
  onPenSelect,
}: {
  onPenSelect?: (
    name: string,
    options?: { color?: string; thickness?: number }
  ) => void;
}) => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedThickness, setSelectedThickness] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showThicknessPicker, setShowThicknessPicker] = useState(false);
  const [activeToolName, setActiveToolName] = useState("Pen");

  const handlePenToolClick = (penName: string) => {
    setActiveToolName(penName);

    if (penName === "Highlighter" && !selectedColor.includes("rgba")) {
      setSelectedColor(HIGHLIGHTER_COLORS[0]);
    }

    onPenSelect &&
      onPenSelect(penName, {
        color:
          penName === "Highlighter" && !selectedColor.includes("rgba")
            ? HIGHLIGHTER_COLORS[0]
            : selectedColor,
        thickness: selectedThickness,
      });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    onPenSelect &&
      onPenSelect(
        activeToolName === "Highlighter" ? "Highlighter" : "ColorPen",
        {
          color,
          thickness: selectedThickness,
        }
      );
  };

  const handleThicknessSelect = (thickness: number) => {
    setSelectedThickness(thickness);
    setShowThicknessPicker(false);
    onPenSelect &&
      onPenSelect(
        activeToolName === "Highlighter" ? "Highlighter" : "ColorPen",
        {
          color: selectedColor,
          thickness,
        }
      );
  };

  const availableColors =
    activeToolName === "Highlighter" ? HIGHLIGHTER_COLORS : PEN_COLORS;

  return (
    <div className='flex flex-col gap-2 p-2'>
      <div className='flex justify-between items-center border-b pb-2'>
        <span className='text-sm font-medium'>Drawing Tools</span>
      </div>
      <div className='grid grid-cols-2 gap-3 py-2'>
        {pens.map((pen) => (
          <div
            key={pen.name}
            className={`flex flex-col items-center justify-center rounded-md p-2 transition duration-200 cursor-pointer ${
              activeToolName === pen.name
                ? "bg-[#dde4fc]"
                : "hover:bg-[#dde4fc]"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePenToolClick(pen.name);
            }}
          >
            {pen.icon}
            <span className='text-xs mt-1'>{pen.name}</span>
          </div>
        ))}
      </div>
      <Divider className='text-neutral-500 w-full my-1' />
      <div className='flex justify-between items-center'>
        <div className='flex flex-col items-center relative'>
          <span className='text-xs mb-1'>Thickness</span>
          <div
            className='cursor-pointer'
            onClick={() => setShowThicknessPicker(!showThicknessPicker)}
          >
            <Thickness className='w-[27px] h-[27px]' />
          </div>

          {showThicknessPicker && (
            <div className='absolute top-12 left-0 bg-white shadow-lg rounded-md p-2 z-10 w-32'>
              <div className='flex flex-col gap-2'>
                {PEN_THICKNESS.map((thickness) => (
                  <div
                    key={thickness}
                    className='flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer'
                    onClick={() => handleThicknessSelect(thickness)}
                  >
                    <div
                      className='w-full h-0 border-t border-black'
                      style={{ borderTopWidth: `${thickness}px` }}
                    />
                    <span className='text-xs'>{thickness}px</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col items-center relative'>
          <span className='text-xs mb-1'>Color</span>
          <div
            className='cursor-pointer'
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <div
              className='w-[27px] h-[27px] rounded-full border border-gray-300'
              style={{ backgroundColor: selectedColor }}
            />
          </div>

          {showColorPicker && (
            <div className='absolute top-12 right-0 bg-white shadow-lg rounded-md p-2 z-10 w-36'>
              <div className='grid grid-cols-4 gap-2'>
                {availableColors.map((color) => (
                  <div
                    key={color}
                    className={`w-6 h-6 rounded-full cursor-pointer border hover:scale-110 transition-transform ${
                      selectedColor === color
                        ? "border-2 border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShapesToolbar = ({
  onShapeSelect,
}: {
  onShapeSelect?: (name: string) => void;
}) => {
  return (
    <div className='flex flex-col gap-2 p-2'>
      <div className='flex justify-between items-center border-b pb-2'>
        <span className='text-sm font-medium'>Shape Tools</span>
      </div>
      <div className='grid grid-cols-3 gap-2 py-2'>
        {shapes.map((shape) => (
          <div
            key={shape.name}
            className='flex flex-col items-center justify-center rounded-md p-2 hover:bg-[#dde4fc] transition duration-200 cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShapeSelect && onShapeSelect(shape.name);
            }}
          >
            <div className='flex items-center justify-center h-8'>
              {shape.icon}
            </div>
            <span className='text-xs mt-1 text-center'>{shape.name}</span>
          </div>
        ))}
      </div>
      <div className='flex flex-col w-full gap-1 mt-2'>
        <button
          className={`w-full py-2 text-center bg-neutral-200 hover:bg-neutral-300 transition ${nunito.className} rounded-md text-sm`}
        >
          All shapes
        </button>
      </div>
    </div>
  );
};

const ConnectionLineToolbar = ({
  onShapeSelect,
}: {
  onShapeSelect?: (name: string) => void;
}) => {
  return (
    <div className='flex flex-col gap-2 p-2'>
      <div className='flex justify-between items-center border-b pb-2'>
        <span className='text-sm font-medium'>Connection Tools</span>
      </div>
      <div className='grid grid-cols-2 gap-2 py-2'>
        {lines.map((line) => (
          <div
            key={line.name}
            className='flex flex-col items-center justify-center rounded-md p-2 hover:bg-[#dde4fc] transition duration-200 cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShapeSelect && onShapeSelect(line.name);
            }}
          >
            <div className='flex items-center justify-center h-8'>
              {line.icon}
            </div>
            <span className='text-xs mt-1 text-center'>{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StickyNoteToolbar = ({
  onShapeSelect,
}: {
  onShapeSelect?: (name: string) => void;
}) => {
  return (
    <div className='flex flex-col gap-2 p-2'>
      <div className='flex justify-between items-center border-b pb-2'>
        <span className='text-sm font-medium'>Sticky Notes</span>
      </div>
      <div className='grid grid-cols-2 gap-4 mt-2'>
        {stickyNotes.map((color) => (
          <div
            key={color}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShapeSelect && onShapeSelect(`Sticky note:${color}`);
            }}
            className='flex items-center justify-center'
          >
            <div
              className='w-12 h-12 flex items-center justify-center rounded-md hover:scale-110 transition cursor-pointer'
              style={{
                backgroundColor: color,
                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                transform: "rotate(-2deg)",
              }}
            >
              <span
                className='text-xs text-center line-clamp-2 px-1'
                style={{
                  color: color === "#FFFF00" ? "#333333" : "#000000",
                }}
              >
                Note
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const items = [
  {
    name: "Select",
    icon: ({ color }: { color?: string }) => (
      <MousePointer2 color={color} fill={color} className='h-7 w-7' />
    ),
  },
  {
    name: "Text",
    icon: ({ color }: { color?: string }) => <Type color={color} />,
  },
  {
    name: "Templates",
    icon: ({ color }: { color?: string }) => <LayoutPanelTop color={color} />,
  },
  {
    name: "Sticky note",
    icon: ({ onClick, onShapeSelect, color }: any) => (
      <Popover placement='right'>
        <PopoverTrigger>
          <div onClick={onClick}>
            <StickyNote2OutlinedIcon sx={{ color }} />
          </div>
        </PopoverTrigger>
        <PopoverContent className='ml-1 bg-white rounded-md flex flex-col p-2 w-[220px] mt-20'>
          <StickyNoteToolbar onShapeSelect={onShapeSelect} />
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: "Shapes",
    icon: ({ onClick, onShapeSelect, color }: any) => (
      <Popover placement='right'>
        <PopoverTrigger>
          <div onClick={onClick}>
            <InterestsOutlinedIcon sx={{ color }} />
          </div>
        </PopoverTrigger>
        <PopoverContent className='ml-1 bg-white rounded-md flex flex-col p-2'>
          <ShapesToolbar onShapeSelect={onShapeSelect} />
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: "Connection line",
    icon: ({ onClick, onShapeSelect, color }: any) => (
      <Popover placement='right'>
        <PopoverTrigger>
          <div onClick={onClick}>
            <TrendingUpDown color={color} />
          </div>
        </PopoverTrigger>
        <PopoverContent className='ml-1 bg-white rounded-md flex flex-col'>
          <ConnectionLineToolbar onShapeSelect={onShapeSelect} />
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: "Drawing Tools",
    icon: ({ onClick, onPenSelect, color }: any) => (
      <Popover placement='right'>
        <PopoverTrigger>
          <div onClick={onClick}>
            <Brush color={color} />
          </div>
        </PopoverTrigger>
        <PopoverContent className='ml-1 bg-white rounded-md flex flex-col p-1 gap-2'>
          <PenToolbar onPenSelect={onPenSelect} />
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: "Comment",
    icon: <MessageSquareText />,
  },
  {
    name: "Frame",
    icon: <Crop />,
  },
  {
    name: "Upload",
    icon: <Upload />,
  },
  {
    name: "More apps",
    icon: <AddBoxIcon />,
  },
];
