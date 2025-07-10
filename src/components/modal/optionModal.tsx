import { useModalStore } from '@/stores/modalStore';

import { Button } from '@/components/common/button';

import Cart from '@/assets/icons/cartBtn.svg?react';

export default function OptionModal({ type }: { type?: string }) {
  const { closeModal } = useModalStore();
  return (
    <div>
      <div className="px-4">
        <div className="w-full border border-black h-10">hi</div>
      </div>
      <div className="flex items-center pl-4">
        <Cart />
        <Button kind="basic" variant="solid-orange" className="w-full" onClick={() => closeModal()}>
          팀 생성하기
        </Button>
      </div>
    </div>
  );
}
