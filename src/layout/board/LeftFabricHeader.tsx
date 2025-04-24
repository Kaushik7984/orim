import { Divider } from "@mui/material";
import { Fira_Sans } from "next/font/google";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IosShareIcon from "@mui/icons-material/IosShare";
import SearchIcon from "@mui/icons-material/Search";
import { useBoard } from "@/context/BoardContext/useBoard";

const fira_sans = Fira_Sans({
  subsets: ["latin"],
  weight: ["500"],
});

const LeftFabricHeader = () => {
  const { boardName } = useBoard();
  return (
    <div
      className='flex flex-row rounded-md bg-white border border-gray-200 p-1 items-center ml-1 mt-1'
      style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }}
    >
      <h1
        className={`font-semibold text-2xl ${fira_sans.className} px-2 hover:bg-[#fed2cf] cursor-pointer rounded-md duration-200 mr-1`}
      >
        Orim
      </h1>
      <span className='rounded-2xl bg-neutral-200 px-2 py-1 text-violet-950 text-sm mr-1'>
        free
      </span>
      <Divider orientation='vertical' flexItem />
      <p className='rounded-md p-2 hover:bg-[#fed2cf] duration-200 cursor-pointer text-sm ml-1'>
        {boardName || "Untitled"}
      </p>
      <span className='p-2 rounded-md hover:bg-[#fed2cf] duration-200 cursor-pointer'>
        <MoreVertIcon />
      </span>
      <span className='p-2 rounded-md hover:bg-[#fed2cf] duration-200 cursor-pointer'>
        <IosShareIcon />
      </span>
      <span className='p-2 rounded-md hover:bg-[#fed2cf] duration-200 cursor-pointer'>
        <SearchIcon />
      </span>
    </div>
  );
};

export default LeftFabricHeader;
