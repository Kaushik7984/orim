import LeftFabricHeader from "./LeftFabricHeader";
import RightFabricHeader from "./RightFabricHeader";

import { FabricHeaderProps } from "@/types";

const FabricHeader: React.FC<FabricHeaderProps> = () => {
  return (
    <div className='top-0 w-full z-30 absolute'>
      <div className='flex flex-row items-center p-2 justify-between'>
        <LeftFabricHeader />
        <RightFabricHeader />
      </div>
    </div>
  );
};

export default FabricHeader;
