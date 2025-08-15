import { useEffect, useMemo, useRef, useState } from 'react';

import type { TReviewItem } from '@/types/board/reviewBoard';

import { useReviews } from '@/hooks/board/useReviews';
import { useTeamProducts } from '@/hooks/board/useTeamProducts';
import useInfiniteObserver from '@/hooks/common/useInfiniteObserver';
import useUserInfo from '@/hooks/members/useUserInfo';

import HorizontalProductCard from '@/components/board/HorizontalProductCard';
import { PageButton, type TabId } from '@/components/common/button';
import InfiniteScrollSentinel from '@/components/common/infiniteScroll';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';
import ReviewCard from '@/components/product/reviewCard';

export default function Board() {
  const [selectedTop1, setSelectedTop1] = useState<TabId>('review');
  const [sortType, setSortType] = useState<'LATEST' | 'RECOMMEND'>('LATEST');

  const [hasInitReview, setHasInitReview] = useState<boolean>(true);

  const [pageReview, setPageReview] = useState(0);
  const [pageTeam, setPageTeam] = useState(0);
  const [accReviews, setAccReviews] = useState<TReviewItem[]>([]);
  const [accTeams, setAccTeams] = useState<any[]>([]);

  const isReviewTab = selectedTop1 === 'review';
  const isTeamTab = selectedTop1 === 'team';

  const {
    reviews,
    page: reviewPage,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    isFetched: isFetchedReviews,
    refetch: refetchReviews,
  } = useReviews({
    sort: sortType,
    page: pageReview,
    enabled: isReviewTab && hasInitReview,
  });

  const { data: teamData, isLoading, isError, isFetched } = useTeamProducts(pageTeam);

  const { data: userInfo } = useUserInfo();
  useEffect(() => {
    if (userInfo) console.log('[유저 정보 응답]', userInfo);
  }, [userInfo]);
  useEffect(() => {
    if (isFetchedReviews) console.log('[리뷰 API 요청 완료]', reviews, reviewPage);
  }, [isFetchedReviews, reviews, reviewPage]);
  useEffect(() => {
    if (isFetched) console.log('[팀 모집 API 요청 완료]', teamData);
  }, [isFetched, teamData]);

  useEffect(() => {
    if (hasInitReview) {
      setPageReview(0);
      setAccReviews([]);
    }
  }, [sortType, hasInitReview]);
  const reviewItems = useMemo(() => (reviews as TReviewItem[] | undefined) ?? [], [reviews]);
  useEffect(() => {
    if (hasInitReview && !isLoadingReviews && !isErrorReviews) {
      setAccReviews((prev) => (pageReview === 0 ? reviewItems : [...prev, ...reviewItems]));
    }
  }, [reviewItems, isLoadingReviews, isErrorReviews, pageReview, hasInitReview]);

  const teamList = teamData || [];
  useEffect(() => {
    if (!isLoading && !isError) {
      setAccTeams((prev) => (pageTeam === 0 ? teamList : [...prev, ...teamList]));
    }
  }, [teamList, isLoading, isError, pageTeam]);

  const TEAM_PAGE_SIZE = 5;
  const hasNextTeam = teamList.length === TEAM_PAGE_SIZE;

  const REVIEW_PAGE_SIZE = reviewPage?.size ?? 5;
  const currentReviewPage = reviewPage?.currentPage ?? pageReview;
  const totalReviews = reviewPage?.totalElements ?? 0;
  const hasNextReviews = !!reviewPage?.hasNextPage || totalReviews > (currentReviewPage + 1) * REVIEW_PAGE_SIZE;

  const enableInfiniteReviews = isReviewTab && hasInitReview && hasNextReviews && accReviews.length > 5 && !isLoadingReviews;
  const enableInfiniteTeams = isTeamTab && hasNextTeam && accTeams.length > 5 && !isLoading;

  const scrollRootRef = useRef<HTMLDivElement | null>(null);

  const reviewSentinelRef = useInfiniteObserver({
    enabled: enableInfiniteReviews,
    onIntersect: () => setPageReview((p) => p + 1),
    root: scrollRootRef.current,
    rootMargin: '0px 0px 300px 0px',
    threshold: 0,
  });

  const teamSentinelRef = useInfiniteObserver({
    enabled: enableInfiniteTeams,
    onIntersect: () => setPageTeam((p) => p + 1),
    root: scrollRootRef.current,
    rootMargin: '0px 0px 300px 0px',
    threshold: 0,
  });

  const handleTopSelect = (tab: TabId) => {
    setSelectedTop1(tab);
    if (tab === 'review') {
      if (!hasInitReview) {
        setHasInitReview(true);
        refetchReviews();
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-3">
        <Header />
      </header>

      <PageButton items={['review', 'team']} selected={selectedTop1} onSelect={handleTopSelect} />

      <div ref={scrollRootRef} className="relative flex-1 overflow-y-auto mb-20">
        <ul className="absolute inset-0 bg-white px-4 py-3 flex flex-col gap-3">
          {isReviewTab ? (
            <>
              <div className="flex justify-end text-body-regular text-black-4 mb-1">
                {[
                  { label: '최신순', value: 'LATEST' },
                  { label: '추천순', value: 'RECOMMEND' },
                ].map(({ label, value }, index, array) => (
                  <div key={value} className="flex items-center">
                    <button onClick={() => setSortType(value as 'LATEST' | 'RECOMMEND')} className={sortType === value ? 'text-body-medium text-black' : ''}>
                      {label}
                    </button>
                    {index < array.length - 1 && <span className="px-3 text-black-2">|</span>}
                  </div>
                ))}
              </div>

              {pageReview === 0 && accReviews.length === 0 && hasInitReview && (isLoadingReviews || !isFetchedReviews) ? (
                <p className="text-center text-black-3">리뷰 로딩 중...</p>
              ) : isErrorReviews && pageReview === 0 && hasInitReview ? (
                <p className="text-center text-error-3">리뷰 로드 실패</p>
              ) : accReviews.length === 0 && hasInitReview ? (
                <p className="text-center text-black-3">리뷰가 없습니다.</p>
              ) : (
                accReviews.map((r) => (
                  <div key={r.review.id} className="border-b border-black-1">
                    <ReviewCard review={r.review} isLike={r.isLike} imageUrls={r.imageUrls} />
                  </div>
                ))
              )}

              {/* 센티넬(리뷰) — 컨테이너 내부 하단 */}
              <InfiniteScrollSentinel ref={reviewSentinelRef} style={{ height: 1 }} />
            </>
          ) : (
            <>
              {/* 팀 리스트 (원본 흐름) */}
              {pageTeam === 0 && accTeams.length === 0 && (isLoading || !isFetched) ? (
                <p className="text-center text-black-3">팀 모집 목록 로딩 중...</p>
              ) : isError && pageTeam === 0 ? (
                <p className="text-center text-error-3">모집중인 팀이 없습니다</p>
              ) : accTeams.length === 0 ? (
                <p className="text-center text-black-3">모집중인 팀이 없습니다</p>
              ) : (
                accTeams.map((item) => <HorizontalProductCard key={item.teamId} data={item} />)
              )}

              {/* 센티넬(팀) */}
              <InfiniteScrollSentinel ref={teamSentinelRef} style={{ height: 1 }} />
            </>
          )}
        </ul>
      </div>

      <BottomBar />
    </div>
  );
}
