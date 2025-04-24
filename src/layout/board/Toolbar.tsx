import { motion } from "framer-motion";
import React, { useState } from "react";
import { items } from "./ToolbarIcons";
import { LayoutPanelLeft, Redo, Undo } from "lucide-react";

const Toolbar = ({
  setIsOpen,
  isOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <motion.div className='flex flex-col items-center mt-12 ml-1'>
      <div
        className='flex flex-col rounded-md bg-white items-center'
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`rounded-md p-2 duration-200 cursor-pointer m-0.5 ${
              activeItem === item.name ? "bg-[#dde4fc]" : "hover:bg-[#dde4fc]"
            }`}
          >
            {item.icon}
          </div>
        ))}
      </div>

      <div
        className='mt-4 flex flex-col items-center rounded-md bg-white'
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        <div className='rounded-md p-2 hover:bg-[#dde4fc] duration-200 cursor-pointer m-0.5'>
          <Undo />
        </div>
        <div className='rounded-md p-2 hover:bg-[#dde4fc] duration-200 cursor-pointer'>
          <Redo />
        </div>
      </div>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-md p-2.5 duration-200 cursor-pointer mt-1 ${
          isOpen ? "bg-[#dde4fc]" : "bg-white hover:bg-[#dde4fc]"
        }`}
        style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
      >
        <LayoutPanelLeft />
      </div>
    </motion.div>
  );
};

export default Toolbar;
