import { useNavigate } from 'react-router-dom';

import { BENEFIT_LIST } from '@/constants/myPage/benefitList';
import { MAIN_FUNCTIONS } from '@/constants/myPage/mainFunctions';
import { SUB_FUNCTIONS } from '@/constants/myPage/subFunctions';

import useLogout from '@/hooks/auth/useLogout';
import useUserInfo from '@/hooks/myPage/useUserInfo';

import BenefitCard from '@/components/benefitCard';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';

import Right from '@/assets/right.svg?react';

export default function MyPage() {
  const { data } = useUserInfo();
  const { logout } = useLogout();
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen">
      <header className="px-3">
        <Header />
      </header>
      <div className="w-full bg-white text-black">
        <section className="w-full pt-2 pb-2.5 px-4">
          <button onClick={() => navigate('/mypage/me')} className="w-full h-23 border border-black-2 rounded flex items-center px-5 py-4 gap-3 mb-5">
            <div className="w-15 shrink-0">
              <img src={data?.result.profileUrl} alt="프로필" className="w-15 h-15 rounded-full object-cover" />
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-1 py-2">
              <p className="text-body-medium">{data?.result.name}</p>
              <p className="text-body-regular text-black-4">내 정보 관리</p>
            </div>
            <div>
              <Right />
            </div>
          </button>
          <div className="w-full grid grid-cols-2">
            {MAIN_FUNCTIONS.map(({ key, label, icon, path }, idx) => {
              const Icon = icon;
              return (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className={`w-full py-3.5 flex flex-col items-center justify-center text-body-regular gap-2 ${idx % 2 === 0 ? 'border-r border-black-1' : ''}
                  ${idx < 2 ? 'border-b border-black-1' : ''}`}
                >
                  <Icon />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="w-full pt-2.5 pb-6">
          <p className="flex-1 text-subtitle-medium px-5 pt-3 pb-4">오늘의 혜택</p>
          <div className="w-full flex overflow-x-auto gap-x-2 px-4">
            {BENEFIT_LIST.map(({ id, content }) => (
              <BenefitCard key={id} content={content} />
            ))}
          </div>
        </section>

        <section className="w-full pt-6 pb-20">
          <div className="w-full">
            {SUB_FUNCTIONS.map(({ id, name, path }, idx) => (
              <button
                onClick={() => {
                  if (path) window.open(path, '_blank');
                  if (name === '로그아웃') logout();
                }}
                key={id}
                className={`${name === '로그아웃' ? 'text-error-3' : 'text-black'}
                  ${idx > 0 ? 'border-t-2 border-black-0' : ''}
                  text-body-regular text-left w-full px-5 py-5 flex items-center justify-between`}
              >
                <span>{name}</span>
                {name === '앱 버전' && <span>1.1</span>}
              </button>
            ))}
          </div>
        </section>
      </div>
      <BottomBar />
    </div>
  );
}
