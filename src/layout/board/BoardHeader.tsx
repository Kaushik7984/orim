"use client";
import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlinePresentToAll } from "react-icons/md";
import { BiMinus, BiPlus } from "react-icons/bi";
import { TbScreenShare } from "react-icons/tb";
import { RxDividerVertical } from "react-icons/rx";

interface BoardHeaderProps {
  boardName: string;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const BoardHeader = ({ boardName, zoomLevel, onZoomIn, onZoomOut }: BoardHeaderProps) => {
  return (
    <div className="absolute top-0 left-12 right-0 h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        <h1 className="text-base font-medium">{boardName}</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <BsThreeDots className="w-5 h-5 text-gray-600" />
        </button>
        <RxDividerVertical className="h-6 w-6 text-gray-300" />
        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <FiShare2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <MdOutlinePresentToAll className="w-4 h-4" />
          <span>Present</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center border border-gray-200 rounded-md">
          <button 
            onClick={onZoomOut}
            className="p-1 hover:bg-gray-100"
          >
            <BiMinus className="w-5 h-5 text-gray-600" />
          </button>
          <span className="px-2 py-1 text-sm border-l border-r border-gray-200">
            {zoomLevel}%
          </span>
          <button 
            onClick={onZoomIn}
            className="p-1 hover:bg-gray-100"
          >
            <BiPlus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded-md">
          <TbScreenShare className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default BoardHeader; 