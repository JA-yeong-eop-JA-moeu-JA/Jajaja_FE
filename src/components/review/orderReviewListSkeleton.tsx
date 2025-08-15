export default function OrderReviewListSkeleton() {
  return (
    <div className="w-full flex flex-col items-start justify-center pl-4 pr-3 pt-3 pb-2 animate-pulse">
      <div className="w-20 h-5 bg-black-2 rounded mb-5" />

      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center">
          <div className="w-21 h-21 bg-black-2 rounded" />

          <div className="ml-3 flex-1">
            <div className="h-4 w-20 bg-black-2 rounded mb-2" />
            <div className="h-4 w-32 bg-black-2 rounded mb-1" />
            <div className="h-4 w-24 bg-black-2 rounded mb-2" />
            <div className="h-4 w-16 bg-black-2 rounded" />
          </div>
        </div>

        <div className="w-full h-10 bg-black-2 rounded mt-3 mb-7" />
      </div>
    </div>
  );
}
