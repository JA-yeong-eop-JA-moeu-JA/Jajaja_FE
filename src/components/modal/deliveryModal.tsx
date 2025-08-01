import { useModalStore } from '@/stores/modalStore';

import Close from '@/assets/icons/close.svg?react';

const DELIVERY_OPTIONS = [
  { id: 1, text: '문 앞에 놓아주세요.' },
  { id: 2, text: '경비실에 맡겨주세요.' },
  { id: 3, text: '택배함에 넣어주세요.' },
  { id: 4, text: '배송 전에 연락 주세요.' },
];

export default function DeliveryRequestModal() {
  const { closeModal, options } = useModalStore();

  const handleSelect = (text: string) => {
    if (options?.onSelect) {
      options.onSelect(text);
    }
    closeModal();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-subtitle-medium text-orange">배송 요청사항</h2>
        <Close className="w-5 h-5 cursor-pointer" onClick={() => closeModal()} />
      </div>

      <div className="space-y-6">
        {DELIVERY_OPTIONS.map(({ id, text }) => (
          <div key={id} className="cursor-pointer" onClick={() => handleSelect(text)}>
            <p className="text-body-regular0">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
