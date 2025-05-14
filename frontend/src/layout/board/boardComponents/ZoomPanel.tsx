import { Expand, HelpCircle, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface ZoomPanelProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView?: () => void;
}

const ZoomPanel = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onFitView,
}: ZoomPanelProps) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const helpContent = [
    {
      title: "Navigation & Zoom",
      items: [
        "Use mouse wheel to zoom in/out",
        "Hold Right click to pan the canvas",
        "Use Ctrl + mouse wheel for precise zooming",
        "Double-click: Reset zoom level",
        "Click the expand icon to fit view",
        "Current zoom level is shown in percentage",
      ],
    },
    {
      title: "Drawing Tools",
      items: [
        "Select tool: Click and drag to select objects",
        "Pen tool: Draw freehand lines with adjustable thickness",
        "Highlighter: Semi-transparent drawing tool",
        "Eraser: Remove parts of drawings",
        "Shapes: Rectangle, Circle, Triangle, Polygon",
        "Text: Add and edit text elements",
        "Sticky notes: Add colored text boxes",
      ],
    },
    {
      title: "Collaboration Features",
      items: [
        "Real-time updates: See others' changes instantly",
        "Cursor tracking: See where others are working",
        "Share button: Invite others to collaborate",
        "Auto-save: Changes are saved automatically",
        "Multiple users can edit simultaneously",
      ],
    },
    {
      title: "Keyboard Shortcuts",
      items: [
        "Ctrl + Z: Undo last action",
        "Ctrl + Y: Redo last action",
        "Ctrl + C: Copy selected objects",
        "Ctrl + V: Paste copied objects",
        "Delete: Remove selected objects",
      ],
    },
  ];

  return (
    <>
      <div className='fixed bottom-4 right-4 bg-white shadow-md rounded-lg p-2 flex items-center space-x-2 z-50'>
        <button
          onClick={onFitView}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
        >
          <Expand size={18} />
        </button>
        <button
          onClick={onZoomOut}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
        >
          <ZoomOut size={18} />
        </button>
        <span className='text-sm w-10 text-center hidden sm:inline'>
          {zoomLevel}%
        </span>
        <button
          onClick={onZoomIn}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setIsHelpOpen(true)}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
        >
          <HelpCircle size={18} />
        </button>
      </div>

      <Dialog
        open={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle className='flex justify-between items-center'>
          <span className='text-xl font-semibold'>
            Board Help & Instructions
          </span>
          <IconButton onClick={() => setIsHelpOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
            {helpContent.map((section, index) => (
              <div key={index} className='bg-gray-50 rounded-lg p-4'>
                <h3 className='text-lg font-semibold mb-3 text-blue-600'>
                  {section.title}
                </h3>
                <ul className='space-y-2'>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className='flex items-start'>
                      <span className='text-blue-500 mr-2'>•</span>
                      <span className='text-gray-700'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ZoomPanel;
