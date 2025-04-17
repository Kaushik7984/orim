"use client";
import Board from "@/layout/board/Board";

export default function BoardPage({ params }: { params: { board_id: string } }) {
    return (
        <div className="w-full h-full">
            <Board boardId={params.board_id} />
        </div>
    )
} 