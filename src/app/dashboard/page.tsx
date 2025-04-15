import BoardList from "./_components/board-list";
import BoardCreateButton from "./_components/board-create-button";
import CreateBoardButton from "./_components/create-board-button";

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <BoardCreateButton />
        <CreateBoardButton />
      </div>
      <BoardList />
    </div>
  );
}
