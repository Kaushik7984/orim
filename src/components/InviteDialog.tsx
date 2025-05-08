import React from "react";

interface InviteDialogProps {
  boardId: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function InviteDialog({
  boardId,
  onClose,
  isOpen,
}: InviteDialogProps) {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(boardId);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>Share Board</h2>
        <div className='mb-4'>
          <label
            htmlFor='share-link'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Shareable Board ID
          </label>
          <div className='flex items-center gap-2'>
            <input
              id='share-link'
              type='text'
              value={boardId}
              readOnly
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
            />
            <button
              onClick={handleCopy}
              className='px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md'
            >
              Copy
            </button>
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
