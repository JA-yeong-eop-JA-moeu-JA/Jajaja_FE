import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import useGetMyReview from '@/hooks/review/useGetMyReview';
import useGetReviewable from '@/hooks/review/useGetReviewable';

import { PageButton, type TabId } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import OrderReviewList from '@/components/review/orderReviewList';

import ReviewItem from '../../components/review/reviewItem';

import Receipt from '@/assets/myPage/review/receipt.svg?react';

export default function MyReview() {
  const { data: reviewableData, fetchNextPage: fetchNextPage1, hasNextPage: hasNextPage1, isFetchingNextPage: isFetchingNextPage1 } = useGetReviewable();
  const { data: myReivewData, fetchNextPage: fetchNextPage2, hasNextPage: hasNextPage2, isFetchingNextPage: isFetchingNextPage2 } = useGetMyReview();
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage1 && !isFetchingNextPage1) {
      fetchNextPage1();
    }
  }, [inView, hasNextPage1, isFetchingNextPage1, fetchNextPage1]);

  useEffect(() => {
    if (inView && hasNextPage2 && !isFetchingNextPage2) {
      fetchNextPage1();
    }
  }, [inView, hasNextPage2, 2, fetchNextPage2]);

  const orderData = reviewableData?.pages.flatMap((page) => page.result.orders) ?? [];
  const myReviewData = myReivewData?.pages.flatMap((page) => page.result.reviews) ?? [];

  const [selectedTop1, setSelectedTop1] = useState<TabId>('writeReview');
  return (
    <div className="w-full h-screen relative">
      <PageHeader title="리뷰" />
      <PageButton items={['writeReview', 'myReview']} selected={selectedTop1} onSelect={setSelectedTop1} />
      {selectedTop1 === 'writeReview' ? (
        <div className="flex flex-1 items-center justify-center">
          {orderData.length > 0 ? (
            <div>
              <OrderReviewList orders={orderData} />
              <div ref={ref} className="h-2" />
              {isFetchingNextPage1 && <p className="text-center py-4 text-gray-500">더 불러오는 중...</p>}
            </div>
          ) : (
            <div className="w-full fixed inset-0 pointer-events-none flex flex-col items-center justify-center gap-2">
              <Receipt className="w-40 h-40" />
              <p className="text-black text-subtitle-medium">후기를 작성할 수 있는 주문 내역이 없습니다.</p>
              <div className="text-black-4 text-body-regular text-center">
                <p>자자자 온라인 몰에서 상품 구매 시</p>
                <p>후기를 작성할 수 있습니다.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          {myReviewData.length > 0 ? (
            <div className="w-full flex flex-col items-center justify-center px-4">
              {myReviewData.map((item) => (
                <div key={item.review.id}>
                  <ReviewItem review={item.review} isLike={item.isLike} imageUrls={item.imageUrls} />
                  <div ref={ref} className="h-2" />
                  {isFetchingNextPage1 && <p className="text-center py-4 text-gray-500">더 불러오는 중...</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full fixed inset-0 pointer-events-none flex flex-col items-center justify-center gap-2">
              <Receipt className="w-40 h-40" />
              <p className="text-black text-subtitle-medium">작성한 리뷰가 없습니다.</p>
              <p className="text-black-4 text-body-regular text-center">상품을 주문하고 첫 번째 후기를 작성해보세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
