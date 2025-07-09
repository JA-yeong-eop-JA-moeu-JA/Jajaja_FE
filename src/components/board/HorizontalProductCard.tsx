type THorizontalProductCardProps = {
  data: {
    id: number;
    sale: number;
    price: number;
    name: string;
    imageUrl: string;
    teamLeaderName: string;
    teamLeaderProfileUrl: string;
  };
};

export default function HorizontalProductCard({ data }: THorizontalProductCardProps) {
  const { sale, price, name, imageUrl, teamLeaderName, teamLeaderProfileUrl } = data;

  return (
    <div className="flex w-full p-4 border-b border-b-1" style={{ borderBottomColor: 'var(--color-black-2)' }}>
      <img src={imageUrl} alt={name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />

      <div className="flex flex-col justify-between ml-4 flex-grow">
        {/* 제품 모집을 시작한 팀장(첫사람) 정보입니당 */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <img src={teamLeaderProfileUrl} alt={teamLeaderName} className="w-5 h-5 rounded-full object-cover" />
          <span>{teamLeaderName}</span>
        </div>

        <div className="mt-1 text-base">
          <span className="text-red-500 font-semibold">{sale}% </span>
          <span className="font-bold">{price.toLocaleString()} 원</span>
        </div>

        <p className="text-sm text-black mt-1 leading-tight line-clamp-2">{name}</p>
      </div>
    </div>
  );
}
