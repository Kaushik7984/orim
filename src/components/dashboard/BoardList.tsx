interface BoardListProps {
  boards: any[];
}

export default function BoardList({ boards }: BoardListProps) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      {boards.map((board) => (
        <div key={board.id} className='p-4 border rounded shadow bg-white'>
          <h3 className='font-semibold'>{board.title}</h3>
          <p className='text-sm text-gray-500'>
            {board.description || "No description"}
          </p>
        </div>
      ))}
    </div>
  );
}
