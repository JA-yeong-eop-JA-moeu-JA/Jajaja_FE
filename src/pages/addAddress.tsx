import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import InputField from '@/components/common/InputField';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function AddAddress() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [gateCode, setGateCode] = useState('');
  const [checked, setChecked] = useState(false);

  const isFormValid = name !== '' && phone !== '' && /* address !== '' && */ addressDetail !== '';
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col justify-between max-w-[600px] mx-auto">
      <div>
        <PageHeader title="배송지 추가" />
        <InputField label="성함" placeholder="최대 10글자로 작성해주세요." value={name} onChange={(e) => setName(e.target.value)} />
        <InputField
          label="휴대폰 번호"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
          type="number"
        />
        <div className="px-4">
          <p className="text-body-medium py-3">주소</p>
          <div className="flex mb-3 text-black-4">
            <input
              type="text"
              placeholder="주소 찾기로 입력해주세요."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 border border-black-0 rounded p-3 text-body-regular bg-black-1"
              readOnly
            />
          </div>
          <div className="flex gap-2 mb-4 text-black-4">
            <input
              type="text"
              placeholder="상세 주소"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              className="flex-1 border border-black-1 rounded px-3 py-2.5 text-body-regular"
            />
            <button className="px-4 border border-black-3 text-orange rounded text-body-regular">주소 찾기</button>
          </div>
        </div>
        <InputField
          label="공동 현관 비밀번호 (선택)"
          placeholder="비밀번호를 입력해주세요."
          value={gateCode}
          onChange={(e) => setGateCode(e.target.value.replace(/[^0-9]/g, ''))}
          type="number"
        />
        <div className="flex items-center px-4 py-4.5">
          <BaseCheckbox message="기본 배송지로 설정" checked={checked} onClick={() => setChecked(!checked)} />
        </div>
      </div>

      <div className="w-full px-4 pb-2">
        <Button kind="basic" variant="solid-orange" disabled={!isFormValid} onClick={() => navigate(-1)} className="w-full">
          저장하기
        </Button>
      </div>

      <BottomBar />
    </div>
  );
}
