import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { IDaumPostcodeData } from '@/types/daum';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import InputField from '@/components/common/InputField';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeader from '@/components/head_bottom/PageHeader';

interface IAddressForm {
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipcode: string;
  buildingPassword: string;
  isDefault: boolean;
}

type TInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

export default function AddAddress() {
  const navigate = useNavigate();

  const [form, setForm] = useState<IAddressForm>({
    name: '',
    phone: '',
    address: '',
    addressDetail: '',
    zipcode: '',
    buildingPassword: '',
    isDefault: false,
  });

  const updateField = useCallback(<K extends keyof IAddressForm>(field: K, value: IAddressForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePhoneChange = useCallback<TInputChangeHandler>(
    (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      let formatted = raw;

      if (raw.length < 4) {
        formatted = raw;
      } else if (raw.length < 8) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
      } else {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
      }

      updateField('phone', formatted);
    },
    [updateField],
  );

  const handleAddressSearch = useCallback(() => {
    new (window as any).daum.Postcode({
      oncomplete: (data: IDaumPostcodeData) => {
        const fullAddress = data.roadAddress || data.jibunAddress;

        updateField('address', fullAddress);
        updateField('zipcode', data.zonecode);

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
  }, [updateField]);

  const handleGateCodeChange = useCallback<TInputChangeHandler>(
    (e) => {
      const value = e.target.value;
      const allowed = /^[0-9#*]*$/;

      if (value === '' || allowed.test(value)) {
        updateField('buildingPassword', value);
      }
    },
    [updateField],
  );

  const handleDefaultAddressToggle = useCallback(() => {
    updateField('isDefault', !form.isDefault);
  }, [form.isDefault, updateField]);

  const handleSave = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const isValidPhone = useMemo(() => {
    return /^\d{3}-\d{3,4}-\d{4}$/.test(form.phone);
  }, [form.phone]);

  const isFormValid = useMemo(() => {
    return form.name.trim() !== '' && isValidPhone && form.address.trim() !== '' && form.addressDetail.trim() !== '';
  }, [form.name, isValidPhone, form.address, form.addressDetail]);

  const displayAddress = useMemo(() => {
    return form.address && form.zipcode ? `${form.address} (${form.zipcode})` : '';
  }, [form.address, form.zipcode]);

  return (
    <div className="w-full h-screen flex flex-col justify-between max-w-[600px] mx-auto">
      <div>
        <PageHeader title="배송지 추가" />

        <InputField label="성함" placeholder="최대 10글자로 작성해주세요." value={form.name} onChange={(e) => updateField('name', e.target.value)} />

        <InputField label="휴대폰 번호" placeholder="010-0000-0000" value={form.phone} onChange={handlePhoneChange} type="text" />

        <div className="px-4">
          <p className="text-body-medium py-3">주소</p>

          <div className="flex mb-3 text-black-4">
            <input
              type="text"
              placeholder="주소 찾기로 입력해주세요."
              value={displayAddress}
              className="flex-1 border border-black-0 rounded p-3 text-body-regular bg-black-1"
              readOnly
            />
          </div>

          <div className="flex gap-2 mb-4 placeholder:text-black-4">
            <input
              type="text"
              placeholder="상세 주소"
              value={form.addressDetail}
              onChange={(e) => updateField('addressDetail', e.target.value)}
              className="flex-1 border border-black-1 rounded px-3 py-2.5 text-body-regular"
            />
            <button type="button" onClick={handleAddressSearch} className="px-4 border border-black-3 text-orange rounded text-body-regular transition-colors">
              주소 찾기
            </button>
          </div>
        </div>

        <InputField
          label="공동 현관 비밀번호 (선택)"
          placeholder="비밀번호를 입력해주세요."
          value={form.buildingPassword}
          type="text"
          onChange={handleGateCodeChange}
        />

        <div className="flex items-center px-4 py-4.5 mb-30">
          <BaseCheckbox message="기본 배송지로 설정" checked={form.isDefault} onClick={handleDefaultAddressToggle} />
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button kind="basic" variant="solid-orange" disabled={!isFormValid} onClick={handleSave} className="w-full">
          저장하기
        </Button>
      </div>

      <BottomBar />
    </div>
  );
}
