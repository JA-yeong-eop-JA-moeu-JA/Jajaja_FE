import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { REVIEW_LIST } from '@/constants/product/reviews';

import { Timer } from '@/utils/timer';

import { useModalStore } from '@/stores/modalStore';
import useGetProductDetail from '@/hooks/product/useGetProductDetail';

import { Button } from '@/components/common/button';
import ProductHeader from '@/components/head_bottom/ProductHeader';
import Loading from '@/components/loading';
import ReviewCard from '@/components/product/reviewCard';
import StarRating from '@/components/product/starRating';

import GoUP from '@/assets/icons/goUp.svg?react';
import Share from '@/assets/icons/share.svg?react';

export default function Product() {
  const navigate = useNavigate();

  const { data, isLoading } = useGetProductDetail();
  const { id } = useParams<{ id: string }>();
  const { openModal } = useModalStore();
  const [fold, setFold] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const shortReview = REVIEW_LIST.slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTeamJoinWithModal = (teamId: number) => {
    openModal('bottom-drawer-team', {
      teamId,
      mode: 'team_join',
    });
  };
  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  return (
    <div className="pb-16">
      <ProductHeader />
      <img src={data?.result?.thumbnailUrl} className="w-full" alt={data?.result?.name} />
      <section className="py-5 px-4 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-body-medium">{data?.result?.store}</p>
          <p className="text-body-regular">{data?.result?.name}</p>
        </div>
        <div>
          {data?.result?.discountRate && (
            <div className="flex items-center gap-1 text-body-regular text-black-4">
              <p className="line-through">{data?.result.originPrice.toLocaleString()}</p>
              <p>원</p>
            </div>
          )}
          <div className="flex items-center text-title-medium gap-2 mb-1.5">
            {data?.result?.discountRate && <p className="text-error-3">{data?.result?.discountRate}%</p>}
            <p>{data?.result?.salePrice.toLocaleString()} 원</p>
          </div>

          <div className="flex items-center gap-1 text-body-regular">
            <StarRating star={data?.result?.rating || 0} />
            <p className="text-[#ffc800]">{data?.result?.rating || 0}</p>
            <p className="text-black-4">· {data?.result?.reviewCount || 0} 건 리뷰</p>
          </div>
        </div>
      </section>
      <hr className="border-black-1" />
      <section className="px-4 py-7.5">
        <div className="flex text-body-regular gap-5">
          <div className="text-black-4 flex flex-col gap-3">
            <p>배송 기간</p>
            <p>배송비</p>
          </div>
          <div className="flex flex-col gap-3">
            <p>{data?.result.deliveryPeriod}일 내 도착 예정 (토/일 공휴일 제외)</p>
            <div className="flex flex-col">
              <p>무료</p>
              <p>제주 4000원, 도서 산간 6000원 추가</p>
            </div>
          </div>
        </div>
      </section>
      <hr className="border-black-1" />
      <section className="px-4 py-7.5">
        <p className="text-subtitle-medium mb-8.5">팀 구매 참여</p>
        <div className="flex flex-col gap-7">
          {data?.result.teams.map(({ id: teamId, nickname, expireAt, profileUrl }) => (
            <div key={teamId} className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-body-regular">
                <img className="w-9 h-9" src={profileUrl} />
                <p>{nickname}</p>
              </div>
              <div className="flex items-center gap-3">
                {expireAt && <Timer expireAt={expireAt} />}
                <button className="px-4 py-2 rounded-sm text-body-regular border-1 border-green-hover" onClick={() => handleTeamJoinWithModal(teamId)}>
                  참여
                </button>
              </div>
            </div>
          ))}
          {data?.result.teams.length === 0 && (
            <div className="flex flex-col items-center justify-center pb-5.5 text-body-regular text-black-4">
              <p>모집 중인 팀이 없어요.</p>
              <p>직접 팀을 생성해보세요!</p>
            </div>
          )}
        </div>
      </section>
      <section className={`relative ${!fold ? 'h-155 overflow-hidden' : 'h-full overflow-auto'} w-full`}>
        <img src={data?.result?.imageUrl} className="w-full" />
        {!fold && (
          <div
            className="absolute bottom-0 left-0 flex justify-center items-center h-20 w-full "
            style={{
              background: 'linear-gradient(to bottom, #ffffff00, #ffffffff)',
            }}
          >
            <div className="w-full">
              <Button kind="basic" variant="outline-gray" onClick={() => setFold(!fold)}>
                상세 정보 펼치기 ▼
              </Button>
            </div>
          </div>
        )}
      </section>
      <section className="px-4 pt-7.5 p">
        <p className="text-title-medium mb-3">리뷰</p>
        <div className="flex flex-col gap-3">
          {data?.result.reviews.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <ReviewCard {...item} />
              {idx !== shortReview.length - 1 && <hr className="border-black-1" />}
            </div>
          ))}
          {shortReview.length === 0 && (
            <div className="w-full flex justify-center items-center text-body-regular text-black-4 h-20">
              <p>아직 등록된 리뷰가 없어요.</p>
            </div>
          )}
        </div>
      </section>
      {shortReview.length === 3 && (
        <Button kind="basic" variant="outline-gray" onClick={() => navigate(`/product/${id}/review`)}>
          리뷰 전체보기
        </Button>
      )}
      {showNav && (
        <>
          <div className="fixed bottom-19 left-4 z-30">
            <Share
              onClick={() =>
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => toast.info('링크가 복사되었습니다.'))
                  .catch(() => toast.error('복사에 실패했습니다.'))
              }
            />
          </div>

          <div className="fixed bottom-19 right-4 z-30">
            <GoUP onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          </div>
        </>
      )}
      <footer className="px-4 py-2 fixed bottom-0 max-w-[600px] bg-white w-full h-16 flex justify-center gap-2 items-center text-body-medium text-white">
        <button className="rounded-sm h-12 bg-black py-2.5 w-full" onClick={() => openModal('bottom-drawer-team', { mode: 'individual' })}>
          1인 구매하기
        </button>
        <button className="rounded-sm h-12 bg-orange py-2.5 w-full" onClick={() => openModal('bottom-drawer', { mode: 'team_create' })}>
          팀 생성하기
        </button>
      </footer>
    </div>
  );
}
