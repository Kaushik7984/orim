
// import { Activity_Empty } from "@/svgs/index.svg";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin-ext"],
  weight: ["600"],
});

const ActivitiesState = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center px-3 py-8'>
      <div className='mb-6 w-32 h-32 flex justify-center items-center'>
        {/* <Activity_Empty className='w-full h-full text-gray-300' /> */}
      </div>

      <h4
        className={`${nunito.className} text-center mb-2 text-lg font-semibold`}
      >
        No activity yet
      </h4>

      <p
        className={`text-sm text-center text-neutral-400 max-w-xs ${nunito.className}`}
      >
        Activities will appear here as you collaborate with your team on this
        board
      </p>

      <div className='w-full mt-8 space-y-3 opacity-35'>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className='w-full bg-gray-100 rounded-md p-3 border border-gray-200'
          >
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-gray-200'></div>
              <div className='flex-1'>
                <div className='h-2 w-24 bg-gray-200 rounded-sm'></div>
                <div className='h-2 w-16 bg-gray-200 rounded-sm mt-2'></div>
              </div>
              <div className='text-xs text-gray-400'>
                {index === 0 ? "Just now" : `${index}m ago`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesState;
