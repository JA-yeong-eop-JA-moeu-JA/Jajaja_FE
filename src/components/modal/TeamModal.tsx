import { useNavigate } from 'react-router-dom';

import type { TGetNoti } from '@/types/notifications/TGetNotiList';

import { useModalStore } from '@/stores/modalStore';

export default function TeamModal({ detail }: TGetNoti) {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();
  const { orderId, productName, productImage, isTeamMatched, productId } = detail || {};
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fullImageUrl = productImage?.startsWith('http') ? productImage : `${API_BASE_URL}${productImage}`;

  return (
    <div className="pb-2 pt-9 px-3 flex flex-col gap-8 text-body-regular">
      <div className="flex flex-col items-center justify-center gap-4">
        <img src={fullImageUrl} alt="상품 이미지" className="w-21 h-21" />
        <div className="text-center text-black gap-1">
          <p className="text-subtitle-medium pb-1">{isTeamMatched ? '팀 매칭 완료' : '팀 매칭 실패'}</p>
          <p className="text-body-regular text-orange">{productName}</p>
          <p className="text-body-regular">{isTeamMatched ? '곧 배송이 시작됩니다.' : '결제 금액은 자동으로 환불됩니다.'}</p>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2 my-1">
        <button
          className="w-full py-2.5 bg-black-1 rounded text-black"
          onClick={() => {
            closeModal();
            if (orderId) {
              if (isTeamMatched) {
                navigate(`/mypage/order/orderDetailPersonal?orderId=${orderId}`);
                return;
              }
              navigate(`/product/${productId}`);
            }
          }}
        >
          {isTeamMatched ? '주문 내역' : '팀 다시 모집'}
        </button>
        <button className="w-full py-2.5 bg-orange rounded text-white" onClick={closeModal}>
          확인
        </button>
      </div>
    </div>
  );
}
