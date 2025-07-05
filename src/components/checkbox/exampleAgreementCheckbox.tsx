import type { TCheckboxType } from '@/stores/agreementCheckboxStore';
import { useAgreementCheckboxStore } from '@/stores/agreementCheckboxStore';

import StatefulCheckbox from '@/components/checkbox/StatefulCheckbox';

const AGREEMENT_ITEMS: { type: TCheckboxType; message: string; textClassName?: string }[] = [
  { type: 'agree-all', message: '전체 동의', textClassName: 'text-[18px] leading-6 font-medium text-[#1E1E1E]' },
  { type: 'terms-service', message: '서비스 이용 약관 (필수)' },
  { type: 'terms-privacy', message: '개인정보 수집 및 이용 동의 (필수)' },
  { type: 'terms-age', message: '만 14세 이상 확인 (필수)' },
  { type: 'terms-financial', message: '전자금융거래 이용 약관 (필수)' },
  { type: 'terms-marketing', message: '마케팅 정보 수신 동의 (선택)' },
];

export default function ExampleAgreementCheckbox() {
  return (
    <div className="flex flex-col gap-2 mt-10">
      {AGREEMENT_ITEMS.map((item) => (
        <StatefulCheckbox key={item.type} id={item.type} useStore={useAgreementCheckboxStore} message={item.message} textClassName={item.textClassName} />
      ))}
    </div>
  );
}
