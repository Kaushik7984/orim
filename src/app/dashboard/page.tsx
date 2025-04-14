import BoardCreateButton from "./_components/board-create-button";
import BoardList from "./_components/board-list";

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <BoardCreateButton />
      </div>
      <BoardList />
    </div>
  );
}
