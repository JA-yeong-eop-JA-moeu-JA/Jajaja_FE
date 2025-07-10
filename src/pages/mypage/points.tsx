import PageHeader from '@/components/head_bottom/PageHeader';

import { pointData, PointLabel } from '@/mocks/pointData';

export default function Points() {
  return (
    <div className="w-full h-screen">
      <PageHeader title="포인트" />
      <div className="w-full flex flex-col items-center justify-center gap-6 px-4 mb-9">
        <div className="flex flex-col items-center justify-center gap-1 w-full border border-black-1 rounded py-4">
          <p className="text-subtitle-medium text-black">현재 보유 포인트</p>
          <p className="text-green-hover text-title-medium">12,094 원</p>
        </div>
        <div className="w-full">
          {pointData.map((point) => (
            <div key={point.id} className={`flex items-start justify-between py-5 ${point.id > 1 ? 'border-t border-black-1' : ''}`}>
              <p className="text-black-4 text-body-regular">{point.createdAt}</p>
              <div className="flex flex-col items-start justify-center gap-1">
                <p className="text-black text-body-medium">{PointLabel[point.type]}</p>
                <p className="text-black text-body-regular">{point.content}</p>
                <p className="text-black-4 text-small-medium mt-1">{point.expiredAt} 소멸 예정</p>
              </div>
              <p className="text-orange text-title-medium">+{point.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
