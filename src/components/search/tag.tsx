import Delete from '@/assets/icons/delete.svg?react';

interface ITagProps {
  msg: string;
  onDelete: () => void;
}

export default function Tag({ msg, onDelete }: ITagProps) {
  return (
    <div className="border-1 pl-4 pr-3.5 mt-2.5 border-black-2 rounded-[40px] h-10 inline-flex items-center justify-center min-w-3 shrink-0 max-w-full">
      {msg}
      <Delete onClick={onDelete} className="h-3 w-3 ml-2 cursor-pointer" />
    </div>
  );
}
