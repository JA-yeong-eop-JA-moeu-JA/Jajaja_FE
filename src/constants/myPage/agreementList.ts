import type { TCheckboxType } from '@/stores/agreementCheckboxStore';

export interface IAgreement {
  id: number;
  type: TCheckboxType;
  name: string;
  path: string;
}

export const AGREEMENT: IAgreement[] = [
  { id: 1, type: 'terms-service', name: '서비스 이용 약관 (필수)', path: '' },
  { id: 2, type: 'terms-privacy', name: '개인정보 수집 및 이용 동의 (필수)', path: '' },
  { id: 3, type: 'terms-age', name: '만 14세 이상 확인 (필수)', path: '' },
  { id: 4, type: 'terms-financial', name: '전자금융거래 이용 약관 (필수)', path: '' },
  { id: 5, type: 'terms-marketing', name: '마케팅 정보 수신 동의 (선택)', path: '' },
];
