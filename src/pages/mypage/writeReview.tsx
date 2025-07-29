import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import ImageUploader from '@/components/review/imageUploader';
import OrderItem from '@/components/review/orderItem';
import ReviewStarRating from '@/components/review/reviewStarRating';

import NotFoundPage from '../feedback/NotFoundPage';

import { orderData } from '@/mocks/orderData';

export default function WriteReview() {
  const { orderId, productId } = useParams<{ orderId: string; productId: string }>();
  const order = orderData.find((item) => item.id === Number(orderId));
  const product = order?.items.find((item) => item.productId === Number(productId));
  const [comment, setComment] = useState('');
  const [star, setStar] = useState(false);
  const handleRatingChange = (score: number) => {
    setStar(true);
    console.log('선택한 별점:', score);
  };
  const handleImagesChange = (files: File[]) => {
    console.log(files);
  };

  if (!order || !product) {
    return <NotFoundPage />;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <div>
        <PageHeader title="리뷰 작성" />
        <div className="w-full px-4">
          <div className="py-2">
            <OrderItem item={product} show={false} />
          </div>
          <div className="w-full">
            <ReviewStarRating initialRating={0} onChange={handleRatingChange} />
          </div>
          <div className="w-full border border-black-1 rounded-lg mt-4 mb-6 px-4 pt-3">
            <textarea
              className="w-full text-black text-body-regular resize-none"
              placeholder="내용을 입력해주세요."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={7}
            />
            <p className="text-end text-black-4 text-small-medium pb-2">{comment.length}/500</p>
          </div>

          <div>
            <ImageUploader maxCount={5} onChange={handleImagesChange} />
          </div>
        </div>
      </div>
      <Button kind="basic" variant="solid-orange" onClick={() => {}} disabled={comment.trim().length == 0 || star === false}>
        리뷰 등록
      </Button>
    </div>
  );
}
