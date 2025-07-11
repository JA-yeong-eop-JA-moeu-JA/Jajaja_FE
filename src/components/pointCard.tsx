import { PointLabel, type TPointType } from '@/mocks/pointData';

type TPointProps = {
    point:{
        id: number;
        createdAt: string;
        type: TPointType;
        content: string;
        expiredAt: string;
        amount: number;
    }
}

export default function PointCard({point}:TPointProps) {
    return (
        <div key={point.id} className={`flex items-start justify-between py-5 ${point.id > 1 ? 'border-t border-black-1' : ''}`}>
            <div className="flex items-start justify-start w-full">
                <p className="text-black-4 text-body-regular pr-5">{point.createdAt}</p>
                <div className="flex flex-col items-start justify-center gap-1 pr-7.5">
                  <p className="text-black text-body-medium">{PointLabel[point.type]}</p>
                  <p className="text-black text-body-regular">{point.content}</p>
                  <p className="text-black-4 text-small-medium mt-1">{point.expiredAt} 소멸 예정</p>
                </div>
            </div>
            <p className="text-orange text-title-medium">+{point.amount}</p>      
        </div>
    )
}