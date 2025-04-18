import { createClient, BaseUserMeta } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
  throttle: 16,
});

// Types for presence (shared user state)
export type Presence = {
  cursor: { x: number; y: number } | null;
  selection: string[];
  color: string;
  tool: "select" | "pen" | "rectangle" | "ellipse" | "text";
  isDrawing: boolean;
  name: string;
};

// Types for storage (persisted shared state)
export type Storage = {
  objects: any[];
  version: number;
};

// Types for custom events
type CustomEvent = {
  type: "CANVAS_UPDATED";
  data: {
    objects: any;
  };
};

// Combine with BaseUserMeta for proper typing
export type CanvasEvent = CustomEvent & BaseUserMeta;

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useStorage,
  useMutation,
  useSelf,
} = createRoomContext<Presence, Storage, CanvasEvent>(client);
