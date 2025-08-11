import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { IUpdateAddressRequest } from '@/types/address/TAddress';
import type { IDaumPostcodeData } from '@/types/daum';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { useUpdateAddress } from '@/hooks/address/useAddress';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import InputField from '@/components/common/InputField';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function EditAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { address: initialAddress } = location.state || { address: null };
  const { mutate: updateAddress, isPending } = useUpdateAddress();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [gateCode, setGateCode] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      setName(initialAddress.name || '');
      setPhone(initialAddress.phone || '');
      setAddress(initialAddress.address || '');
      setAddressDetail(initialAddress.addressDetail || '');
      setZipcode(initialAddress.zipcode || '');
      setGateCode(initialAddress.buildingPassword || '');
      setChecked(initialAddress.isDefault || false);
    }
  }, [initialAddress]);

  const handleAddressSearch = useCallback(() => {
    new (window as any).daum.Postcode({
      oncomplete: (data: IDaumPostcodeData) => {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setAddress(fullAddress);
        setZipcode(data.zonecode);

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

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;

    if (raw.length < 4) {
      formatted = raw;
    } else if (raw.length < 8) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }

    setPhone(formatted);
  }, []);

  const handleGateCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const allowed = /^[0-9#*]*$/;
    if (value === '' || allowed.test(value)) {
      setGateCode(value);
    }
  }, []);

  const isValidPhone = /^\d{3}-\d{3,4}-\d{4}$/.test(phone);
  const isFormValid = name.trim() !== '' && isValidPhone && address.trim() !== '' && addressDetail.trim() !== '' && zipcode.trim() !== '';

  const handleSave = () => {
    if (!isFormValid || !initialAddress) return;

    const request: IUpdateAddressRequest = {
      recipientName: name,
      phone,
      address,
      detailAddress: addressDetail,
      zipCode: zipcode,
      buildingPassword: gateCode || undefined,
      isDefault: checked,
    };

    updateAddress(
      { addressId: initialAddress.id, request },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_ADDRESSES });
          queryClient.refetchQueries({ queryKey: QUERY_KEYS.GET_ADDRESSES });
          navigate(-1);
        },
        onError: (error: AxiosError) => {
          console.error('배송지 수정 실패:', error);
        },
      },
    );
  };

  // 초기 데이터 없으면 이전 페이지로 이동
  if (!initialAddress) {
    navigate(-1);
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-between max-w-[600px] mx-auto">
      <div>
        <PageHeader title="배송지 수정" />

        <InputField label="성함" placeholder="최대 10글자로 작성해주세요." value={name} onChange={(e) => setName(e.target.value)} />

        <InputField label="휴대폰 번호" placeholder="010-0000-0000" value={phone} onChange={handlePhoneChange} type="text" />

        <div className="px-4">
          <p className="text-body-medium py-3">주소</p>
          <div className="flex mb-3 text-black-4">
            <input
              type="text"
              placeholder="주소 찾기로 입력해주세요."
              value={address && zipcode ? `${address} (${zipcode})` : address}
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
            <button
              type="button"
              onClick={handleAddressSearch}
              className="px-4 border border-black-3 text-orange rounded text-body-regular transition-colors hover:bg-orange hover:text-white"
            >
              주소 찾기
            </button>
          </div>
        </div>

        <InputField label="공동 현관 비밀번호 (선택)" placeholder="비밀번호를 입력해주세요." value={gateCode} type="text" onChange={handleGateCodeChange} />

        <div className="flex items-center px-4 py-4.5 mb-30">
          <BaseCheckbox message="기본 배송지로 설정" checked={checked} onClick={() => setChecked(!checked)} />
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button kind="basic" variant="solid-orange" disabled={!isFormValid || isPending} onClick={handleSave} className="w-full">
          {isPending ? '수정 중...' : '수정하기'}
        </Button>
      </div>

      <BottomBar />
    </div>
  );
}
