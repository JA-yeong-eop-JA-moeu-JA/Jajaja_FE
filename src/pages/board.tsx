import { useEffect, useMemo, useState } from 'react';

import type { TReviewItem } from '@/types/board/reviewBoard';

import { useReviews } from '@/hooks/board/useReviews';
import { useTeamProducts } from '@/hooks/board/useTeamProducts';
import useUserInfo from '@/hooks/myPage/useUserInfo';

import HorizontalProductCard from '@/components/board/HorizontalProductCard';
import { PageButton } from '@/components/common/button';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';
import ReviewCard from '@/components/product/reviewCard';

export default function Board() {
  const [selectedTop2, setSelectedTop2] = useState<'review' | 'team'>('review');
  const [sortType, setSortType] = useState<'latest' | 'recommend'>('latest');
  const [page, setPage] = useState(0);

  const { reviews, page: reviewPage, isLoading: isLoadingReviews, isError: isErrorReviews, isFetched: isFetchedReviews } = useReviews({ sort: sortType, page });

  const { data, isLoading, isError, isFetched } = useTeamProducts(page);

  const mappedReviews = useMemo(() => {
    return (
      (reviews as TReviewItem[] | undefined)?.map((item) => ({
        id: item.review.id,
        imageUrl: '',
        name: item.review.nickname,
        date: item.review.createDate,
        star: item.review.rating,
        likeCount: item.review.likeCount,
        product: item.review.option || '',
        review: item.review.content,
        images: item.imageUrls,
      })) ?? []
    );
  }, [reviews]);

  const teamList = data || [];

  //  const canPrevReviews = page > 0;
  //  const canNextReviews =
  //    !!reviewPage?.hasNextPage ||
  //    ((reviewPage?.totalElements ?? 0) >
  //      ((reviewPage?.currentPage ?? page) + 1) * REVIEW_PAGE_SIZE);

  const TEAM_PAGE_SIZE = 5;
  const canPrevTeam = page > 0;
  const canNextTeam = teamList.length === TEAM_PAGE_SIZE;

  const { data: userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo) {
      console.log('[유저 정보 응답]', userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (isFetchedReviews) {
      console.log('[리뷰 API 요청 완료]', reviews, reviewPage);
    }
  }, [isFetchedReviews, reviews, reviewPage]);

  useEffect(() => {
    setPage(0);
  }, [sortType]);

  useEffect(() => {
    if (isFetched) {
      console.log('[팀 모집 API 요청 완료]', data);
    }
  }, [isFetched, data]);

  useEffect(() => {
    console.log('[reviewPage]', reviewPage);
  }, [reviewPage]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-3">
        <Header />
        <PageButton
          items={['review', 'team']}
          selected={selectedTop2}
          onSelect={(tab) => {
            setSelectedTop2(tab as 'review' | 'team');
            setPage(0);
          }}
        />
      </header>

      <div className="relative flex-1 overflow-y-auto">
        <ul key={selectedTop2 + sortType + page} className="absolute inset-0 bg-white px-4 py-3 flex flex-col gap-3">
          {selectedTop2 === 'review' ? (
            <>
              <div className="flex justify-end text-body-regular text-black-4 mb-1">
                {[
                  { label: '최신순', value: 'latest' },
                  { label: '추천순', value: 'recommend' },
                ].map(({ label, value }, index, array) => (
                  <div key={value} className="flex items-center">
                    <button onClick={() => setSortType(value as 'latest' | 'recommend')} className={sortType === value ? 'text-body-medium text-black' : ''}>
                      {label}
                    </button>
                    {index < array.length - 1 && <span className="px-1 text-black-2">|</span>}
                  </div>
                ))}
              </div>

              {isLoadingReviews ? (
                <p className="text-center text-black-3">리뷰 로딩 중...</p>
              ) : isErrorReviews ? (
                <p className="text-center text-error-3">리뷰 로드 실패</p>
              ) : mappedReviews.length === 0 ? (
                <p className="text-center text-black-3">리뷰가 없습니다.</p>
              ) : (
                mappedReviews.map((r) => <ReviewCard key={r.id} data={r} />)
              )}

              {(() => {
                const REVIEW_PAGE_SIZE = reviewPage?.size ?? 5;
                const currentPage = reviewPage?.currentPage ?? page;
                const total = reviewPage?.totalElements ?? 0;

                const canPrevReviews = currentPage > 0;
                const canNextReviews = !!reviewPage?.hasNextPage || total > (currentPage + 1) * REVIEW_PAGE_SIZE;

                return (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <button
                      className={`px-2 py-1 rounded disabled:opacity-40 ${canPrevReviews ? 'text-black-4' : 'text-black-1'} border`}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      aria-label="이전 페이지"
                      disabled={!canPrevReviews}
                    >
                      &lt;
                    </button>
                    <p className="text-black-3">|</p>
                    <button
                      className={`px-2 py-1 rounded disabled:opacity-40 ${canNextReviews ? 'text-black-4' : 'text-black-1'} border`}
                      onClick={() => setPage((p) => p + 1)}
                      aria-label="다음 페이지"
                      disabled={!canNextReviews}
                    >
                      &gt;
                    </button>
                  </div>
                );
              })()}
            </>
          ) : (
            <>
              {isLoading ? (
                <p className="text-center text-black-3">팀 모집 목록 로딩 중...</p>
              ) : isError ? (
                <p className="text-center text-error-3">팀 모집 목록을 불러올 수 없습니다.</p>
              ) : (
                teamList.map((item) => <HorizontalProductCard key={item.teamId} data={item} />)
              )}

              <div className="flex items-center justify-center gap-3 py-4">
                <button
                  className={`px-2 py-1 rounded disabled:opacity-40 ${canNextTeam ? 'text-black-4' : 'text-black-3'}`}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  aria-label="이전 페이지"
                  disabled={!canPrevTeam}
                >
                  &lt;
                </button>
                <p className="text-black-1">|</p>
                <button
                  className={`px-1 py-1 rounded disabled:opacity-40 ${canNextTeam ? 'text-black-4' : 'text-black-3'}`}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="다음 페이지"
                  disabled={!canNextTeam}
                >
                  &gt;
                </button>
              </div>
            </>
          )}
        </ul>
      </div>

      <BottomBar />
    </div>
  );
}
