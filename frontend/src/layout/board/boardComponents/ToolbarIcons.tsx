import { useState } from "react";

import { Nunito } from "next/font/google";

import AddBoxIcon from "@mui/icons-material/AddBox";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InterestsOutlinedIcon from "@mui/icons-material/InterestsOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import { Box, Divider, Popover } from "@mui/material";
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
import { HexColorPicker } from "react-colorful";

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
    icon: <PolygonIcon />,
    name: "Polygon",
  },
  {
    icon: <FavoriteBorderIcon />,
    name: "Heart",
  },
  {
    icon: <ChatBubbleOutlineIcon />,
    name: "Speech bubble",
  },
  {
    icon: <StraightLineIcon />,
    name: "Line",
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

// Add these at the top level, outside of any component
const LAST_USED_COLORS = {
  pen: "#000000",
  highlighter: HIGHLIGHTER_COLORS[0],
};

const PenToolbar = ({
  onPenSelect,
  onClose,
}: {
  onPenSelect?: (
    name: string,
    options?: { color?: string; thickness?: number }
  ) => void;
  onClose?: () => void;
}) => {
  const [selectedColor, setSelectedColor] = useState(LAST_USED_COLORS.pen);
  const [selectedThickness, setSelectedThickness] = useState(3);
  const [activeToolName, setActiveToolName] = useState("Pen");
  const [thicknessAnchorEl, setThicknessAnchorEl] =
    useState<HTMLElement | null>(null);
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);

  const handleThicknessClick = (event: React.MouseEvent<HTMLElement>) => {
    setThicknessAnchorEl(event.currentTarget);
  };

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleThicknessClose = () => {
    setThicknessAnchorEl(null);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handlePenToolClick = (penName: string) => {
    setActiveToolName(penName);

    if (penName === "Highlighter") {
      setSelectedColor(LAST_USED_COLORS.highlighter);
      setSelectedThickness(15);
    } else {
      setSelectedColor(LAST_USED_COLORS.pen);
      setSelectedThickness(3);
    }

    onPenSelect &&
      onPenSelect(penName, {
        color:
          penName === "Highlighter"
            ? LAST_USED_COLORS.highlighter
            : LAST_USED_COLORS.pen,
        thickness: penName === "Highlighter" ? 15 : selectedThickness,
      });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Update last used color
    if (activeToolName === "Highlighter") {
      LAST_USED_COLORS.highlighter = color;
    } else {
      LAST_USED_COLORS.pen = color;
    }
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
        <button
          onClick={onClose}
          className='hover:bg-gray-100 rounded-full p-1 transition-colors'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </button>
      </div>
      <div className='grid grid-cols-2 gap-3 py-2'>
        {pens.map((pen) => (
          <div
            key={pen.name}
            className='flex flex-col items-center justify-center rounded-md p-2 hover:bg-[#dde4fc] transition duration-200 cursor-pointer'
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
          <div className='cursor-pointer' onClick={handleThicknessClick}>
            <Thickness className='w-[27px] h-[27px]' />
          </div>

          <Popover
            open={Boolean(thicknessAnchorEl)}
            anchorEl={thicknessAnchorEl}
            onClose={handleThicknessClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <div className='p-2 w-32'>
              <div className='flex flex-col gap-2'>
                {PEN_THICKNESS.map((thickness) => (
                  <div
                    key={thickness}
                    className='flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer'
                    onClick={() => {
                      handleThicknessSelect(thickness);
                      handleThicknessClose();
                    }}
                  >
                    <div
                      className='w-full h-2 bg-black rounded-full'
                      style={{ height: `${thickness}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Popover>
        </div>

        <div className='flex flex-col items-center relative'>
          <span className='text-xs mb-1'>Color</span>
          <div className='cursor-pointer' onClick={handleColorClick}>
            <div
              className='w-6 h-6 rounded-full border border-gray-300'
              style={{ backgroundColor: selectedColor }}
            />
          </div>

          <Popover
            sx={{
              mt: "-55px",
              ml: "40px",
            }}
            open={Boolean(colorAnchorEl)}
            anchorEl={colorAnchorEl}
            onClose={handleColorClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Box className='p-4 '>
              <HexColorPicker
                color={selectedColor}
                onChange={handleColorSelect}
              />
              <div className='mt-4 grid grid-cols-4 gap-2'>
                {availableColors.map((color) => (
                  <div
                    key={color}
                    className='w-6 h-6 rounded-full cursor-pointer border border-gray-300'
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      handleColorSelect(color);
                      handleColorClose();
                    }}
                  />
                ))}
              </div>
            </Box>
          </Popover>
        </div>
      </div>
    </div>
  );
};

const ShapesToolbar = ({
  onShapeSelect,
  onClose,
}: {
  onShapeSelect?: (name: string) => void;
  onClose?: () => void;
}) => {
  return (
    <div className='flex flex-col p-2'>
      <div className='flex justify-between items-center border-b pb-2'>
        <span className='text-sm font-medium'>Shape Tools</span>
      </div>
      <div className='grid grid-cols-2'>
        {shapes.map((shape) => (
          <div
            key={shape.name}
            className='flex flex-col items-center justify-center rounded-md p-2 hover:bg-[#dde4fc] transition duration-200 cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShapeSelect && onShapeSelect(shape.name);
              onClose && onClose();
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
  onClose,
}: {
  onShapeSelect?: (name: string) => void;
  onClose?: () => void;
}) => {
  return (
    <div className='flex flex-col p-2'>
      <div className='flex justify-between items-center border-b pb-2'>
        <span className='text-sm font-medium'>Connection Tools</span>
      </div>
      <div className='grid grid-cols-2'>
        {lines.map((line) => (
          <div
            key={line.name}
            className='flex flex-col items-center justify-center rounded-md p-2 hover:bg-[#dde4fc] transition duration-200 cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShapeSelect && onShapeSelect(line.name);
              onClose && onClose();
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
  onClose,
}: {
  onShapeSelect?: (name: string) => void;
  onClose?: () => void;
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
              onClose && onClose();
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

const StickyNoteIcon = ({ onClick, onShapeSelect, color }: any) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onClick && onClick(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className='hover:bg-[#dde4fc] rounded-md  transition-colors duration-200'
      >
        <StickyNote2OutlinedIcon sx={{ color }} />
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          className: "ml-6 -mt-16 bg-white rounded-md flex flex-col p-2 w-[220px]",
        }}
      >
        <StickyNoteToolbar
          onShapeSelect={onShapeSelect}
          onClose={handleClose}
        />
      </Popover>
    </>
  );
};

const ShapesIcon = ({ onClick, onShapeSelect, color }: any) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onClick && onClick(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className='hover:bg-[#dde4fc] rounded-md transition-colors duration-200'
      >
        <InterestsOutlinedIcon sx={{ color }} />
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          className: "ml-6 -mt-16 bg-white rounded-md flex flex-col ",
        }}
      >
        <ShapesToolbar onShapeSelect={onShapeSelect} onClose={handleClose} />
      </Popover>
    </>
  );
};

const ConnectionLineIcon = ({ onClick, onShapeSelect, color }: any) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onClick && onClick(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className='hover:bg-[#dde4fc] rounded-md transition-colors duration-200'
      >
        <TrendingUpDown color={color} />
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          className: "ml-6 -mt-16 bg-white rounded-md flex flex-col",
        }}
      >
        <ConnectionLineToolbar
          onShapeSelect={onShapeSelect}
          onClose={handleClose}
        />
      </Popover>
    </>
  );
};

const DrawingToolsIcon = ({ onClick, onPenSelect, color }: any) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onClick && onClick(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className='hover:bg-[#dde4fc] rounded-md transition-colors duration-200'
      >
        <Brush color={color} />
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          className: "ml-6 -mt-16 bg-white rounded-md flex flex-col p-1 gap-2",
        }}
      >
        <PenToolbar onPenSelect={onPenSelect} onClose={handleClose} />
      </Popover>
    </>
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
    icon: StickyNoteIcon,
  },
  {
    name: "Shapes",
    icon: ShapesIcon,
  },
  {
    name: "Connection line",
    icon: ConnectionLineIcon,
  },
  {
    name: "Drawing Tools",
    icon: DrawingToolsIcon,
  },
  {
    name: "Frame",
    icon: ({ color }: { color?: string }) => <Crop color={color} />,
  },
  {
    name: "Comment",
    icon: ({ color }: { color?: string }) => (
      <MessageSquareText color={color} />
    ),
  },
  {
    name: "Upload",
    icon: ({ color }: { color?: string }) => <Upload color={color} />,
  },
  {
    name: "More apps",
    icon: ({ color }: { color?: string }) => <AddBoxIcon sx={{ color }} />,
  },
];
