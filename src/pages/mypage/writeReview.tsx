import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TReviewableOrderItem } from '@/types/review/myReview';
import type { TUrlSet } from '@/types/s3/TPostUpload';

import { useReviewImageStore } from '@/stores/reviewImageStore';
import usePostReview from '@/hooks/review/usePostReview';
import usePostUploadList from '@/hooks/s3/usePostUploadList';
import usePutUpload from '@/hooks/s3/usePutUpload';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import ReviewImageUploader from '@/components/review/imageUploader';
import OrderItem from '@/components/review/orderItem';
import ReviewStarRating from '@/components/review/reviewStarRating';

export default function WriteReview() {
  const location = useLocation();
  const item = (location.state as { item: TReviewableOrderItem })?.item;
  const { mutate } = usePostReview();
  const { mutateAsync: requestPresignedUrl } = usePostUploadList();
  const { mutateAsync: putUpload } = usePutUpload();
  const navigate = useNavigate();
  useEffect(() => {
    if (!item) {
      alert('잘못된 접근입니다.');
      navigate(-1);
    }
  }, [item, navigate]);
  const [comment, setComment] = useState('');
  const [star, setStar] = useState(0);
  const handleRatingChange = (score: number) => {
    setStar(score);
  };

  const files = useReviewImageStore((s) => s.files);
  const resetFiles = useReviewImageStore((s) => s.reset);

  useEffect(() => {
    return () => {
      // 페이지 떠날 때 파일 초기화(선택)
      resetFiles();
    };
  }, [resetFiles]);

  const handleSubmit = async () => {
    try {
      if (!files || files.length === 0) {
        mutate({
          productId: item.productId,
          rating: star,
          content: comment,
          imageKeys: [],
        });
        return;
      }

      const fileNames = files.map((f) => f.name);
      const { result } = await requestPresignedUrl({ fileName: fileNames });

      const urlSets: TUrlSet[] = result.presignedUrlUploadResponses;

      if (!Array.isArray(urlSets) || urlSets.length !== files.length) {
        alert('업로드 URL 생성에 실패했습니다. 다시 시도해 주세요.');
        return;
      }

      await Promise.all(urlSets.map((set, i) => putUpload({ url: set.url, file: files[i] })));
      const imageKeys = urlSets.map((s) => s.keyName);

      mutate({
        productId: item.productId,
        rating: star,
        content: comment,
        imageKeys,
      });
    } catch (error) {
      console.error(error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <div>
        <PageHeader title="리뷰 작성" />
        <div className="w-full px-4">
          <div className="py-2">
            <OrderItem item={item} show={false} />
          </div>
          <div className="w-full">
            <ReviewStarRating initialRating={0} onChange={handleRatingChange} />
          </div>
          <div className="w-full border border-black-1 rounded-lg mt-4 mb-6 px-4 pt-3">
            <textarea
              className="w-full text-black text-[16px] resize-none"
              placeholder="내용을 입력해주세요."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={7}
            />
            <p className="text-end text-black-4 text-small-medium pb-2">{comment.length}/500</p>
          </div>

          <div>
            <ReviewImageUploader />
          </div>
        </div>
      </div>
      <Button kind="basic" variant="solid-orange" onClick={handleSubmit} disabled={comment.trim().length == 0 || star === 0}>
        리뷰 등록
      </Button>
    </div>
  );
}
