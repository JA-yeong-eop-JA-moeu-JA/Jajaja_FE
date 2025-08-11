import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { IAddAddressRequest } from '@/types/address/TAddress';
import type { IDaumPostcodeData } from '@/types/daum';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { useAddAddress } from '@/hooks/address/useAddress';

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
  const [zipcode, setZipcode] = useState('');
  const [gateCode, setGateCode] = useState('');
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: addAddress, isPending } = useAddAddress();

  const isValidPhone = useMemo(() => {
    return /^\d{3}-\d{3,4}-\d{4}$/.test(phone);
  }, [phone]);

  const isFormValid = useMemo(() => {
    return name.trim() !== '' && isValidPhone && address.trim() !== '' && addressDetail.trim() !== '' && zipcode.trim() !== '';
  }, [name, isValidPhone, address, addressDetail, zipcode]);

  const displayAddress = useMemo(() => {
    return address && zipcode ? `${address} (${zipcode})` : address;
  }, [address, zipcode]);

  const handleSubmit = () => {
    if (!isFormValid) return;

    const request: IAddAddressRequest = {
      name,
      phone,
      address,
      addressDetail,
      zipcode: zipcode || '', // 우편번호 (필수, 빈 문자열이라도)
      buildingPassword: gateCode || undefined, // 공동현관 비밀번호
      isDefault: checked, // 기본 배송지 여부
    };

    addAddress(request, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_ADDRESSES });
        navigate(-1);
      },
      onError: (error: AxiosError) => {
        console.error('배송지 추가 실패:', error);
        // 에러 처리는 useCoreMutation에서 자동으로 토스트 표시
      },
    });
  };

  const handleAddressSearch = useCallback(() => {
    new (window as any).daum.Postcode({
      oncomplete: (data: IDaumPostcodeData) => {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setAddress(fullAddress);
        setZipcode(data.zonecode);

        // 상세 주소 입력 필드로 포커스 이동
        setTimeout(() => {
          const detailInput = document.querySelector('input[placeholder="상세 주소"]') as HTMLInputElement;
          if (detailInput) {
            detailInput.focus();
          }
        }, 100);
      },
      width: '100%',
      height: '100%',
    }).open();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleGateCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const allowed = /^[0-9#*]*$/;
    if (value === '' || allowed.test(value)) {
      setGateCode(value);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between max-w-[600px] mx-auto">
      <div>
        <PageHeader title="배송지 추가" />

        <InputField
          label="성함"
          placeholder="최대 10글자로 작성해주세요."
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 10))} // 10글자 제한
        />

        <InputField label="휴대폰 번호" placeholder="010-0000-0000" value={phone} onChange={handlePhoneChange} type="tel" />

        <div className="px-4">
          <p className="text-body-medium py-3">주소</p>
          <div className="flex mb-3 text-black-4">
            <input
              type="text"
              placeholder="주소 찾기로 입력해주세요."
              value={displayAddress}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 border border-black-0 rounded p-3 text-body-regular bg-black-1"
              readOnly
            />
          </div>
          <div className="flex gap-2 mb-4 placeholder:text-black-4">
            <input
              type="text"
              placeholder="상세 주소"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              className="flex-1 border border-black-1 rounded px-3 py-2.5 text-body-regular"
            />
            <button
              type="button"
              className="px-4 border border-black-3 text-orange rounded text-body-regular transition-colors hover:bg-orange hover:text-white"
              onClick={handleAddressSearch}
            >
              주소 찾기
            </button>
          </div>

          <input
            type="text"
            placeholder="우편번호 (선택)"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            className="w-full border border-black-1 rounded px-3 py-2.5 text-body-regular mb-4"
          />
        </div>

        <InputField label="공동 현관 비밀번호 (선택)" placeholder="비밀번호를 입력해주세요." value={gateCode} type="text" onChange={handleGateCodeChange} />

        <div className="flex items-center px-4 py-4.5 mb-30">
          <BaseCheckbox message="기본 배송지로 설정" checked={checked} onClick={() => setChecked(!checked)} />
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button kind="basic" variant="solid-orange" disabled={!isFormValid || isPending} onClick={handleSubmit} className="w-full">
          {isPending ? '저장 중...' : '저장하기'}
        </Button>
      </div>

      <BottomBar />
    </div>
  );
}
