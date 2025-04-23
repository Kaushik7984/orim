import { ZoomIn, ZoomOut, HelpCircle, Expand } from "lucide-react";

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
  return (
    <div className='absolute bottom-4 right-4 bg-white shadow-md rounded-lg p-2 flex items-center space-x-2 z-50'>
      <button onClick={onFitView} className='p-1 hover:bg-gray-100 rounded'>
        <Expand size={18} />
      </button>
      <button onClick={onZoomOut} className='p-1 hover:bg-gray-100 rounded'>
        <ZoomOut size={18} />
      </button>
      <span className='text-sm w-10 text-center'>{zoomLevel}%</span>
      <button onClick={onZoomIn} className='p-1 hover:bg-gray-100 rounded'>
        <ZoomIn size={18} />
      </button>
      <button className='p-1 hover:bg-gray-100 rounded'>
        <HelpCircle size={18} />
      </button>
    </div>
  );
};

export default ZoomPanel;
