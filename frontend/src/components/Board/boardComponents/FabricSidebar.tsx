import { FabricSidebarProps } from "@/types";
import { motion } from "framer-motion";
import { useState } from "react";
import SlideSidebar from "./SlideSidebar";
import Toolbar from "./Toolbar";

interface ExtendedFabricSidebarProps extends FabricSidebarProps {
  onToolSelect: (tool: string | null, subTool: string | null) => void;
}

const FabricSidebar: React.FC<ExtendedFabricSidebarProps> = ({
  editor,
  onToolSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ x: -308 }}
      animate={{ x: isOpen ? 0 : -308 }}
      transition={{ duration: 0.2 }}
      className='h-full left-0 p-2 absolute z-30 flex flex-row mt-14 md:mt-16'
    >
      <SlideSidebar isOpen={isOpen} setIsOpen={setIsOpen} editor={editor} />
      <Toolbar
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        onToolSelect={onToolSelect}
      />
    </motion.div>
  );
};

export default FabricSidebar;
