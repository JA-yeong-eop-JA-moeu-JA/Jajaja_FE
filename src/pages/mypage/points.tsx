import PageHeader from '@/components/head_bottom/PageHeader';
import PointCard from '@/components/pointCard';

import { pointData } from '@/mocks/pointData';

export default function Points() {
  return (
    <div className="w-full h-screen">
      <PageHeader title="포인트" />
      <div className="w-full flex flex-col items-center justify-center gap-6 px-4 mb-9">
        <div className="flex flex-col items-center justify-center gap-1 w-full border border-black-1 rounded py-4">
          <p className="text-subtitle-medium text-black">현재 보유 포인트</p>
          <p className="text-green-hover text-title-medium">12,094 원</p>
        </div>
        <div className="w-full px-1">
          {pointData.map((point) => (
            <PointCard key={point.id} point={point}/>
          ))}
        </div>
      </div>
    </div>
  );
}
