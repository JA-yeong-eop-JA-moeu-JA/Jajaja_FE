import { useModalStore } from '@/stores/modalStore';

export default function ReviewModal() {
  const { closeModal } = useModalStore();
  return (
    <div className="pb-2 pt-10 px-3 flex flex-col gap-8 text-body-regular">
      <p className="text-center ">등록한 리뷰를 삭제할까요?</p>
      <div className="flex justify-center items-center gap-2 my-1">
        <button className="w-full py-2.5 bg-black-1 rounded text-black" onClick={closeModal}>
          취소
        </button>
        <button className="w-full py-2.5 bg-error-3 rounded text-white" onClick={() => {}}>
          삭제
        </button>
      </div>
    </div>
  );
}
