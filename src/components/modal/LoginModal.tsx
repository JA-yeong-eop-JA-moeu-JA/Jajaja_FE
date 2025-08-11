import { useNavigate } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';

export default function LoginModal() {
  const { closeModal } = useModalStore();
  const navigate = useNavigate();
  return (
    <div className="pb-2 pt-9 px-3 flex flex-col gap-8 text-body-regular">
      <p className="text-center text-black">
        <p className="text-title-semibold pb-1">잠깐!</p>
        <p>서비스 이용을 위해</p>
        <p>로그인이 필요해요.</p>
      </p>
      <div className="flex justify-center items-center gap-2 my-1">
        <button className="w-full py-2.5 bg-black-1 rounded text-black" onClick={closeModal}>
          취소
        </button>
        <button
          className="w-full py-2.5 bg-orange rounded text-white"
          onClick={() => {
            navigate('/login');
            closeModal();
          }}
        >
          로그인
        </button>
      </div>
    </div>
  );
}
