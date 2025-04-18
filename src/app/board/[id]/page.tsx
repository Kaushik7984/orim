import { Suspense } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { Loading } from "@/components/Loading";
import { LiveCanvas } from "@/components/LiveCanvas";

interface BoardPageProps {
  params: {
    id: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
  return (
    <RoomProvider
      id={params.id}
      initialPresence={{
        cursor: null,
        selection: [],
        color: "#000000",
        tool: "select",
        isDrawing: false,
        name: "Anonymous",
      }}
      initialStorage={{
        objects: [],
        version: 1,
      }}
    >
      <main className='h-full w-full relative bg-neutral-100 touch-none'>
        <Suspense fallback={<Loading />}>
          <LiveCanvas boardId={params.id} />
        </Suspense>
      </main>
    </RoomProvider>
  );
}
