import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("./_components/Canvas"), { ssr: false });

export default function BoardPage() {
  return (
    <div className='relative w-full h-screen bg-gray-100'>
      <Canvas />
    </div>
  );
}
