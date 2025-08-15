import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import type { TGetNoti } from '@/types/notifications/TGetNotiList';

import usePatchNotiRead from '@/hooks/notifications/usePatchNotiRead';

import Ad from '@/assets/noti/ad.svg?react';
import AdDisabled from '@/assets/noti/ad-disabled.svg?react';
import Order from '@/assets/noti/order.svg?react';
import OrderDisabled from '@/assets/noti/order-disabled.svg?react';
import Team from '@/assets/noti/team.svg?react';
import TeamDisabled from '@/assets/noti/team-disabled.svg?react';

function getNotiIcon(type: TGetNoti['type'], isRead: boolean) {
  switch (type) {
    case 'MATCHING':
      return isRead ? TeamDisabled : Team;
    case 'DELIVERY':
      return isRead ? OrderDisabled : Order;
    case 'COUPON_AD':
      return isRead ? AdDisabled : Ad;
  }
}

export default function NotiCard({ id, type, title, isRead, createdAt, detail }: TGetNoti) {
  const Icon = getNotiIcon(type, isRead);
  const time = format(new Date(createdAt), 'HH:mm');
  const { mutate: read } = usePatchNotiRead();
  const navigate = useNavigate();

  const handleRead = () => {
    if (!isRead) read(id);
    if (type === 'MATCHING' && detail?.orderId) {
      if (detail?.isTeamMatched) {
        navigate(`/mypage/order/orderDetailPersonal?orderId=${detail?.orderId}`);
      } else {
        navigate(`/product/${detail?.productId}`);
      }
    }
    if (type === 'DELIVERY' && detail?.orderProductId) {
      navigate(`/mypage/deliveryInfo?orderProductId=${detail?.orderProductId}`);
    }
    if (type === 'COUPON_AD') {
      navigate('/mypage/coupon');
    }
  };

  return (
    <button
      className={`w-full px-4 py-3 flex items-center justify-start gap-3
          ${isRead ? 'bg-white' : 'bg-[#FFF9F9]'}`}
      onClick={handleRead}
    >
      <div className="w-10 h-10">{<Icon />}</div>
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-black text-body-regular text-start">{title}</p>
        <p className="text-black-4 text-small-medium">{time}</p>
      </div>
    </button>
  );
}
