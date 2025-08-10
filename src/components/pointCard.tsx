import { format } from 'date-fns';

import { PointLabel, type TPointHistory } from '@/types/points/TGetPoints';

type TPointProps = {
  point: TPointHistory;
};

export default function PointCard({ point }: TPointProps) {
  return (
    <div key={point.id} className={`flex items-start justify-between py-5 ${point.id > 1 ? 'border-t border-black-1' : ''}`}>
      <div className="flex items-start justify-start w-full">
        <p className="text-black-4 text-body-regular pr-5">{format(new Date(point.createdAt), 'MM.dd.')}</p>
        <div className="flex flex-col items-start justify-center gap-1 pr-7.5">
          <p className="text-black text-body-medium">{PointLabel[point.type]}</p>
          <p className="text-black text-body-regular">{point.productName}</p>
          <p className="text-black-4 text-small-medium mt-1">{format(new Date(point.expiresAt), 'yyyy-MM-dd')} 소멸 예정</p>
        </div>
      </div>
      <p className="text-orange text-title-medium">{`${point.type === 'USE' || point.type === 'EXPIRED' ? '-' : '+'}${point.amount}`}</p>
    </div>
  );
}
