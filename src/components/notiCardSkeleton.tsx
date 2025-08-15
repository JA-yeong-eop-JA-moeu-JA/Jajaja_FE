export default function NotiCardSkeleton() {
  return (
    <div className="w-full px-4 py-3 flex items-center justify-start gap-3 bg-gray-50 animate-pulse">
      <div className="w-10 h-10 bg-black-2 rounded" />

      <div className="flex flex-col items-start justify-center gap-2">
        <div className="h-4 w-40 bg-black-2 rounded" />
        <div className="h-3 w-10 bg-black-2 rounded" />
      </div>
    </div>
  );
}
