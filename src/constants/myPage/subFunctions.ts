export interface ISubFunction {
  id: number;
  name: string;
  path: string;
}

export const SUB_FUNCTIONS: ISubFunction[] = [
  { id: 1, name: '1:1 문의', path: '' },
  { id: 2, name: '공지사항', path: '' },
  { id: 3, name: '서비스 이용약관', path: 'https://faceted-pentagon-722.notion.site/24e21a22408780b6ae18c38e3c3d5c94?source=copy_link' },
  { id: 4, name: '개인정보처리방침', path: 'https://faceted-pentagon-722.notion.site/24e21a22408780f08aedf9e7fb7d0af3?source=copy_link' },
  { id: 5, name: '앱 버전', path: '' },
  { id: 6, name: '로그아웃', path: '' },
  { id: 7, name: '회원 탈퇴', path: '' },
];
