export default function PointCardSkeleton({ isFirst = false }: { isFirst?: boolean }) {
  return (
    <div className={`w-full flex items-start justify-between py-5 ${!isFirst ? 'border-t border-black-1' : ''}`}>
      <div className="w-full flex items-start justify-start gap-2">
        <div className="h-4 w-10 bg-black-2 rounded pr-5" />
        <div className="w-full flex flex-col items-start justify-center gap-1 pr-7.5">
          <div className="h-4 w-24 bg-black-2 rounded" />
          <div className="h-4 w-34 bg-black-2 rounded" />
          <div className="h-3 w-30 bg-black-2 rounded mt-1" />
        </div>
      </div>
      <div className="h-6 w-8 bg-black-2 rounded" />
    </div>
  );
}
