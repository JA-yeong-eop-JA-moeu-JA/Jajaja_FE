interface INotiCard {
  id: number;
  type: 'team' | 'order' | 'advertisement';
  content: string;
  createdAt: string;
  isRead: boolean;
  url?: string;
}

export const notiData: INotiCard[] = [
  {
    id: 1,
    type: 'team',
    content: "'복음자리 100% 땅콩버터 스무스 280g' 팀 매칭이 완료됐습니다.",
    createdAt: '2025-07-15 02:00',
    isRead: false,
    url: '',
  },
  {
    id: 2,
    type: 'order',
    content: '딩동! 상품 배송이 시작됐습니다.',
    createdAt: '2025-07-15 01:29',
    isRead: false,
    url: '',
  },
  {
    id: 3,
    type: 'advertisement',
    content: "오늘 하루, '카페' 사장님들께만 드리는 특별 할인 쿠폰이 도착했어요!",
    createdAt: '2025-07-14 21:09',
    isRead: false,
    url: '',
  },
  {
    id: 4,
    type: 'team',
    content: "'미니다크 아메리카노' 팀 매칭이 완료됐습니다.",
    createdAt: '2025-07-14 05:00',
    isRead: true,
    url: '',
  },
  {
    id: 5,
    type: 'order',
    content: '딩동! 상품 배송이 완료되었습니다.',
    createdAt: '2025-07-13 11:29',
    isRead: true,
    url: '',
  },
  {
    id: 6,
    type: 'advertisement',
    content: "한눈에 보는 '유제품' 베스트 컬렉션, 오늘 하루 20% 할인된 가격으로 만나보세요!",
    createdAt: '2025-07-12 21:09',
    isRead: true,
    url: '',
  },
  {
    id: 7,
    type: 'order',
    content: '딩동! 상품 배송이 시작됐습니다.',
    createdAt: '2025-07-01 00:00',
    isRead: false,
    url: '',
  },
  {
    id: 8,
    type: 'team',
    content: "'복음자리 100% 땅콩버터 스무스 280g' 팀 매칭이 완료됐습니다.",
    createdAt: '2025-07-02 00:00',
    isRead: true,
    url: '',
  },
];
