export interface ISubCategory {
  name: string; // 이모지 포함 텍스트
}

export interface ICategoryMap {
  [mainCategory: string]: ISubCategory[];
}

export interface ICategoryData {
  기본: ICategoryMap;
  업종별: ICategoryMap;
}

export const CATEGORY_DATA: ICategoryData = {
  기본: {
    '식품': [{ name: '🥦 채소' }, { name: '🍎 과일' }, { name: '🥩 육류' }, { name: '🧀 유제품' }, { name: '❄️ 냉동식품' }],
    '주방/조리도구': [{ name: '🔪 기본 도구' }, { name: '📦 보관 용품' }, { name: '⚡ 전자제품' }],
    '일회용/소모품': [{ name: '🧂 음식 용기' }, { name: '🥤 컵/빨대' }, { name: '📦 포장재' }, { name: '🍴 수저/냅킨' }],
    '청소/위생': [{ name: '🧹 청소도구' }, { name: '🗑️ 쓰레기' }, { name: '🧼 세제' }],
    '포장/배송': [{ name: '📦 포장 박스' }, { name: '🫧 완충재' }, { name: '📎 테이프/스티커' }],
    '사무용품': [{ name: '🖨️ 사무기기' }, { name: '💳 POS/계산' }, { name: '📢 홍보용품' }],
  },

  업종별: {
    '카페': [{ name: '☕ 원두' }, { name: '🍯 시럽/파우더' }, { name: '🧀 유제품' }, { name: '🥤 컵/빨대' }, { name: '📦 포장 용기' }],
    '베이커리': [{ name: '🌾 밀가루/믹스' }, { name: '🍰 데코/토핑' }, { name: '🧀 유제품' }, { name: '🎂 베이킹 도구' }, { name: '📦 포장 용기' }],
    '일반 음식점': [
      { name: '🧄 기본 식자재' },
      { name: '🐟 육류/어류' },
      { name: '🧀 유제품' },
      { name: '🧂 양념/소스' },
      { name: '📦 포장 용기' },
      { name: '🥡 일회용품' },
    ],
    '샐러드': [{ name: '🥗 채소/과일' }, { name: '🥚 토핑' }, { name: '🥣 믹싱도구' }, { name: '🧂 드레싱/소스' }, { name: '📦 포장 용기' }],
    '도시락/배달': [
      { name: '🍙 밥/면' },
      { name: '🐟 육류/어류' },
      { name: '🧂 양념/소스' },
      { name: '📦 포장 용기' },
      { name: '🥡 일회용품' },
      { name: '📎 테이프/스티커' },
    ],
    '분식/간편식': [{ name: '🍜 떡/면' }, { name: '🍤 튀김 재료' }, { name: '🧂 양념/소스' }, { name: '🥫 가공식품' }, { name: '📦 포장 용기' }],
    '주점': [{ name: '🍢 안주류' }, { name: '❄️ 냉동식품' }, { name: '🍺 주류/음료' }, { name: '🥫 가공식품' }],
  },
};

export const CATEGORY_EMOJIS = new Set([
  '🥦',
  '🍎',
  '🥩',
  '🧀',
  '❄️',
  '🔪',
  '📦',
  '⚡',
  '🧂',
  '🥤',
  '🍴',
  '🧹',
  '🗑️',
  '🧼',
  '🫧',
  '📎',
  '🖨️',
  '💳',
  '📢',
  '☕',
  '🍯',
  '🌾',
  '🍰',
  '🎂',
  '🧄',
  '🐟',
  '🥗',
  '🥚',
  '🥣',
  '🍙',
  '🍜',
  '🍤',
  '🥫',
  '🍢',
  '🍺',
]);
