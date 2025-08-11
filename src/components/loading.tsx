export default function Loading() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 gap-2">
      <div className="animate-spin rounded-full h-15 w-15 border-3 border-t-transparent border-orange-light-active" />
      <p className="text-orange text-body-medium pb-1">Loading</p>
      <p className="text-subtitle-medium text-black">잠시만 기다려주세요.</p>
    </div>
  );
}
