import { useNavigate } from 'react-router-dom';

import PageHeader from '@/components/head_bottom/PageHeader';

import Address from '@/assets/myPage/address.svg?react';
import Profile from '@/assets/myPage/profile.svg?react';

export default function MyDetailPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-black-0">
      <PageHeader title="내 정보 관리" />
      <div className="flex flex-col items-center justify-center px-4 text-subtitle-medium bg-white">
        <button className="w-full flex flex-col items-center justify-center gap-1 pb-6 border-b border-black-1" onClick={() => navigate('/mypage/me/profile')}>
          <Profile className="w-30 h-30" />
          <p>프로필 수정</p>
        </button>
        <button className="w-full flex flex-col items-center justify-center gap-2 pb-6 pt-7" onClick={() => navigate('/address/change')}>
          <Address className="w-30 h-30" />
          <p>배송지 관리</p>
        </button>
      </div>
    </div>
  );
}
