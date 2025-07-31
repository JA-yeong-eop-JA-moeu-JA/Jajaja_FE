import { useModalStore } from '@/stores/modalStore';

export default function ExampleModal() {
  const { closeModal } = useModalStore();
  return (
    <div>
      <p>정말 삭제하시겠습니까?</p>
      <div className="flex justify-end gap-2 mt-4">
        <button>취소</button>
        <button onClick={closeModal}>확인</button>
      </div>
    </div>
  );
}
