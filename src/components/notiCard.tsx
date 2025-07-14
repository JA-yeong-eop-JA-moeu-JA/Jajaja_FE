import Ad from '@/assets/noti/ad.svg?react';
import AdDisabled from '@/assets/noti/ad-disabled.svg?react';
import Order from '@/assets/noti/order.svg?react';
import OrderDisabled from '@/assets/noti/order-disabled.svg?react';
import Team from '@/assets/noti/team.svg?react';
import TeamDisabled from '@/assets/noti/team-disabled.svg?react';

interface INotiCardProps {
  id: number;
  type: 'team' | 'order' | 'advertisement';
  content: string;
  createdAt: string;
  isRead: boolean;
  url?: string;
  onRead?: (id: number) => void;
}

function getNotiIcon(type: INotiCardProps['type'], isRead: boolean) {
  switch (type) {
    case 'team':
      return isRead ? TeamDisabled : Team;
    case 'order':
      return isRead ? OrderDisabled : Order;
    case 'advertisement':
      return isRead ? AdDisabled : Ad;
  }
}

export default function NotiCard({ id, type, content, createdAt, isRead, url, onRead }: INotiCardProps) {
  const Icon = getNotiIcon(type, isRead);
  const time = createdAt.split(' ')[1] || '';

  const handleClick = () => {
    console.log(`Notification ${id} clicked ${url ? `with URL: ${url}` : ''}`);
    if (onRead) onRead(id);
  };

  return (
    <button
      className={`w-full px-4 py-3 flex items-center justify-start gap-3
          ${isRead ? 'bg-white' : 'bg-[#FFF9F9]'}`}
      onClick={handleClick}
    >
      <div className="w-10 h-10">{Icon && <Icon />}</div>
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-black text-body-regular text-start">{content}</p>
        <p className="text-black-4 text-small-medium">{time}</p>
      </div>
    </button>
  );
}
