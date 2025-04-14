import { useParams } from "next/navigation";

export default function BoardPage() {
  const params = useParams();

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Board: {params?.boardId}</h1>
      <p className='text-gray-600'>This is the individual board view.</p>
    </div>
  );
}
