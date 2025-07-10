import { useState } from 'react';

import { useModalStore } from '@/stores/modalStore';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';

import Close from '@/assets/icons/close.svg?react';
import Point from '@/assets/icons/point.svg?react';

export default function HomeModal() {
  const [checked, setChecked] = useState(false);
  const { closeModal } = useModalStore();

  const handleClose = () => {
    if (checked) {
      document.cookie = 'hidePopup=true; max-age=86400; path=/';
    }
    closeModal();
  };

  return (
    <>
      <div className="relative w-full pt-7 px-4 flex flex-col items-center gap-4">
        <div className="absolute top-0 right-0" onClick={handleClose}>
          <Close />
        </div>
        <div className="flex flex-col items-center text-title-semibold">
          <div className="flex items-center">
            <p className="text-orange">근로자의 날</p>
            <p>을 맞아</p>
          </div>
          <div className="flex items-center">
            <p className="text-orange">랜덤 포인트</p>
            <p>가 지급됐어요!</p>
          </div>
          <Point />
        </div>
      </div>

      <div className="w-full px-4">
        <Button kind="basic" variant="solid-orange" className="w-full" onClick={() => closeModal()}>
          기간 한정 포인트 확인하기
        </Button>
      </div>

      <div className="flex items-center p-4">
        <BaseCheckbox message="오늘 하루 보지 않기" checked={checked} onClick={() => setChecked(!checked)} />
      </div>
    </>
  );
}
