export default function CouponCardSkeleton() {
  return (
    <div className="w-full border border-black-1 rounded px-5 py-3 transition flex flex-col gap-2 animate-pulse">
      <div className="bg-black-2 h-6 w-20 rounded" />

      <div className="bg-black-2 h-5 w-full rounded" />

      <div className="flex flex-col gap-1">
        <div className="bg-black-2 h-4 w-2/3 rounded" />
        <div className="bg-black-2 h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}
