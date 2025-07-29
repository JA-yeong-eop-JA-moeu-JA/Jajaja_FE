import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { IAddress } from '@/constants/address/address';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import InputField from '@/components/common/InputField';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function EditAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address: initialAddress } = location.state || { address: null };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [gateCode, setGateCode] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      setName(initialAddress.name || '');
      setPhone(initialAddress.phone || '');
      setAddress(initialAddress.address || '');
      setAddressDetail(initialAddress.detailAddress || '');
      setGateCode(initialAddress.gateCode || '');
      setChecked(initialAddress.isDefault || false);
    }
  }, [initialAddress]);

  const isValidPhone = /^\d{3}-\d{3,4}-\d{4}$/.test(phone);
  const isFormValid = name !== '' && isValidPhone && addressDetail !== '';

  const handleSave = () => {
    const updatedAddress: IAddress = {
      ...initialAddress,
      name,
      phone,
      address,
      detailAddress: addressDetail,
      gateCode,
      isDefault: checked,
    };

    console.log('주소 수정:', updatedAddress);
    navigate(-1);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between max-w-[600px] mx-auto">
      <div>
        <PageHeader title="배송지 수정" />
        <InputField label="성함" placeholder="최대 10글자로 작성해주세요." value={name} onChange={(e) => setName(e.target.value)} />
        <InputField
          label="휴대폰 번호"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, ''); // 숫자만 허용
            let formatted = raw;

            if (raw.length < 4) {
              formatted = raw;
            } else if (raw.length < 8) {
              formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
            } else {
              formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
            }

            setPhone(formatted);
          }}
          type="text"
        />
        <div className="px-4">
          <p className="text-body-medium py-3">주소</p>
          <div className="flex mb-3 text-black-4">
            <input
              type="text"
              placeholder="주소 찾기로 입력해주세요."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 border border-black-0 rounded p-3 text-body-regular bg-black-1 text-black-6 placeholder:text-black-4"
              readOnly
            />
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="상세 주소"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              className="flex-1 border border-black-1 rounded px-3 py-2.5 text-body-regular text-black-6 placeholder:text-black-4"
            />
            <button className="px-4 border border-black-3 text-orange rounded text-body-regular">주소 찾기</button>
          </div>
        </div>
        <InputField
          label="공동 현관 비밀번호 (선택)"
          placeholder="비밀번호를 입력해주세요."
          value={gateCode}
          type="text"
          onChange={(e) => {
            const value = e.target.value;
            const allowed = /^[0-9#*]*$/;
            if (value === '' || allowed.test(value)) {
              setGateCode(value);
            }
          }}
        />
        <div className="flex items-center px-4 py-4.5 mb-30">
          <BaseCheckbox message="기본 배송지로 설정" checked={checked} onClick={() => setChecked(!checked)} />
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button kind="basic" variant="solid-orange" disabled={!isFormValid} onClick={handleSave} className="w-full">
          수정하기
        </Button>
      </div>

      <BottomBar />
    </div>
  );
}
