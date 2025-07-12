import Down from '@/assets/icons/down.svg?react';

interface IAddressBlockProps {
  name: string;
  phone: string;
  address: string;
}

export default function AddressBlock({ name, phone, address }: IAddressBlockProps) {
  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-subtitle-medium">배송지</p>
        <button className="text-orange text-small-medium">변경하기</button>
      </div>
      <p className="text-body-regular mb-1">{name}</p>
      <p className="text-body-regular">{phone}</p>
      <p className="text-body-regular">{address}</p>
      <button className="w-full flex items-center justify-between border border-black-3 text-small-medium text-black-4 rounded mt-3 mb-4 px-4 py-3">
        <span>배송 요청 사항을 선택해주세요.</span>
        <Down className="w-4 h-2" />
      </button>
    </section>
  );
}
