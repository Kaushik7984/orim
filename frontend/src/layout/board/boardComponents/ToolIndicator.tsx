import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Edit as PenIcon,
  TextFields as TextIcon,
  ShapeLine as ShapeIcon,
  Link as ConnectionIcon,
  Comment as CommentIcon,
  Photo as UploadIcon,
  Apps as MoreIcon,
  Circle as CircleIcon,
  Square as RectangleIcon,
  ChangeHistory as TriangleIcon,
  Straighten as LineIcon,
  Star as StarIcon,
  Delete as EraserIcon,
  Brush as HighlighterIcon,
} from "@mui/icons-material";

interface ToolIndicatorProps {
  toolName: string | null;
  subToolName?: string | null;
}

const getToolIcon = (toolName: string | null, subToolName?: string | null) => {
  if (!toolName) return null;

  // Main tool icons
  switch (toolName) {
    case "Select":
      return <MoreIcon className='w-4 h-4' />;
    case "Text":
      return <TextIcon className='w-4 h-4' />;
    case "Templates":
      return <MoreIcon className='w-4 h-4' />;
    case "Sticky note":
      return <CommentIcon className='w-4 h-4' />;
    case "Shapes":
      // Sub-tool icons for shapes
      switch (subToolName) {
        case "Rectangle":
          return <RectangleIcon className='w-4 h-4' />;
        case "Circle":
          return <CircleIcon className='w-4 h-4' />;
        case "Triangle":
          return <TriangleIcon className='w-4 h-4' />;
        case "Line":
          return <LineIcon className='w-4 h-4' />;
        case "Star":
          return <StarIcon className='w-4 h-4' />;
        default:
          return <ShapeIcon className='w-4 h-4' />;
      }
    case "Connection line":
      return <ConnectionIcon className='w-4 h-4' />;
    case "Pen":
      return <PenIcon className='w-4 h-4' />;
    case "Highlighter":
      return <HighlighterIcon className='w-4 h-4' />;
    case "Eraser":
      return <EraserIcon className='w-4 h-4' />;
    case "Comment":
      return <CommentIcon className='w-4 h-4' />;
    case "Frame":
      return <MoreIcon className='w-4 h-4' />;
    case "Upload":
      return <UploadIcon className='w-4 h-4' />;
    case "More apps":
      return <MoreIcon className='w-4 h-4' />;
    default:
      return null;
  }
};

const ToolIndicator: React.FC<ToolIndicatorProps> = ({
  toolName,
  subToolName,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toolName) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toolName, subToolName]);

  const toolIcon = getToolIcon(toolName, subToolName);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className='fixed top-4 left-96 z-50'
        >
          <div className='bg-slate-200 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-lg border border-gray-100'>
            <p className='text-sm font-medium text-gray-700 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
              {toolIcon}
              {subToolName ? `${toolName} - ${subToolName}` : toolName}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolIndicator;
