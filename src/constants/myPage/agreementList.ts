import type { TCheckboxType } from '@/stores/agreementCheckboxStore';

export interface IAgreement {
  id: number;
  type: TCheckboxType;
  name: string;
  path: string;
}

export const AGREEMENT: IAgreement[] = [
  {
    id: 1,
    type: 'terms-service',
    name: '서비스 이용 약관 (필수)',
    path: 'https://faceted-pentagon-722.notion.site/24e21a22408780b6ae18c38e3c3d5c94?source=copy_link',
  },
  {
    id: 2,
    type: 'terms-privacy',
    name: '개인정보 수집 및 이용 동의 (필수)',
    path: 'https://faceted-pentagon-722.notion.site/24e21a22408780f08aedf9e7fb7d0af3?source=copy_link',
  },
  {
    id: 3,
    type: 'terms-age',
    name: '만 14세 이상 확인 (필수)',
    path: 'https://faceted-pentagon-722.notion.site/14-24e21a22408780cc9178fcf5356154ca?source=copy_link',
  },
  {
    id: 4,
    type: 'terms-financial',
    name: '전자금융거래 이용 약관 (필수)',
    path: 'https://faceted-pentagon-722.notion.site/24e21a22408780a59efae934575bbdbe?source=copy_link',
  },
  {
    id: 5,
    type: 'terms-marketing',
    name: '마케팅 정보 수신 동의 (선택)',
    path: 'https://faceted-pentagon-722.notion.site/24e21a22408780fa87f5cbc24d80ae86?source=copy_link',
  },
];
