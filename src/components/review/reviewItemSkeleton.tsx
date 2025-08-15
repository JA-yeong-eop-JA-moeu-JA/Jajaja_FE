export default function ReviewItemSkeleton() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-5 border-b border-black-1 animate-pulse">
      <div className="flex flex-col items-start justify-center gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="h-4 w-16 bg-black-2 rounded" />
          <div className="h-4 w-10 bg-black-2 rounded" />
        </div>

        <div className="flex items-center gap-1">
          <div className="h-4 w-20 bg-black-2 rounded" />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="h-4 w-1/2 bg-black-2 rounded" />
          <div className="h-4 w-1/3 bg-black-2 rounded" />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="h-4 w-full bg-black-2 rounded" />
          <div className="h-4 w-5/6 bg-black-2 rounded" />
          <div className="h-4 w-2/3 bg-black-2 rounded" />
        </div>
      </div>

      <div className="w-full flex items-center gap-2 py-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-19 h-19 bg-black-2 rounded" />
        ))}
      </div>

      <div className="w-full flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-black-2 rounded-full" />
          <div className="h-4 w-6 bg-black-2 rounded" />
        </div>
        <div className="h-6 w-28 bg-black-2 rounded" />
      </div>
    </div>
  );
}
