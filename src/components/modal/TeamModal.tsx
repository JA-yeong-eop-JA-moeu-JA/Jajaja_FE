import { useNavigate } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';

export default function TeamModal(type: 'success' | 'fail') {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();
  return (
    <div className="pb-2 pt-9 px-3 flex flex-col gap-8 text-body-regular">
      <div className="flex flex-col items-center justify-center gap-4">
        {/*  이미지 태그 */}
        <p className="text-center text-black">
          <p className="text-subtitle-medium pb-1">{type === 'success' ? '팀 매칭 완료' : '팀 매칭 실패'}</p>
          <p>{/* 상품명 */}</p>
          <p>{type === 'success' ? '곧 배송이 시작됩니다.' : '결제 금액은 자동으로 환불됩니다.'}</p>
        </p>
      </div>
      <div className="flex justify-center items-center gap-2 my-1">
        <button
          className="w-full py-2.5 bg-black-1 rounded text-black"
          onClick={() => {
            closeModal();
            navigate('/mypage/order');
          }}
        >
          {type === 'success' ? '주문 내역' : '팀 다시 모집'}
        </button>
        <button className="w-full py-2.5 bg-orange rounded text-white" onClick={closeModal}>
          확인
        </button>
      </div>
    </div>
  );
}
