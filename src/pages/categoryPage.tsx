import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import axiosInstance from '@/apis/axiosInstance';

import { PageButton, type TabId } from '@/components/common/button';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';

import GoSearch from '@/assets/ChevronRight.svg';

export const CATEGORY_ICON_MAP: Record<string, string> = {
  '채소': '🥦',
  '과일': '🍎',
  '육류': '🥩',
  '유제품': '🧀',
  '냉동식품': '❄️',
  '기본 도구': '🔪',
  '보관 용품': '📦',
  '전자제품': '⚡',
  '음식 용기': '🧂',
  '컵/빨대': '🥤',
  '포장재': '📦',
  '수저/냅킨': '🍴',
  '청소도구': '🧹',
  '쓰레기': '🗑️',
  '세제': '🧼',
  '포장 용기': '📦',
  '포장 박스': '📦',
  '완충재': '🫧',
  '테이프/스티커': '📎',
  '사무기기': '🖨️',
  'POS/계산': '💳',
  '홍보용품': '📢',
  '원두': '☕',
  '시럽/파우더': '🍯',
  '밀가루/믹스': '🌾',
  '데코/토핑': '🍰',
  '베이킹 도구': '🎂',
  '기본 식자재': '🧄',
  '육류/어류': '🐟',
  '양념/소스': '🧂',
  '일회용품': '🥡',
  '채소/과일': '🥗',
  '토핑': '🥚',
  '믹싱도구': '🥣',
  '밥/면': '🍙',
  '떡/면': '🍜',
  '튀김 재료': '🍤',
  '가공식품': '🥫',
  '안주류': '🍢',
  '주류/음료': '🍺',
};

export default function CategoryPage() {
  const [selectedTop1, setSelectedTop1] = useState<TabId>('basic');
  const [selectedGroup, setSelectedGroup] = useState<'DEFAULT' | 'BUSINESS'>('DEFAULT');

  const [mainCategories, setMainCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);

  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const group = selectedTop1 === 'basic' ? 'DEFAULT' : 'BUSINESS';
    setSelectedGroup(group);
  }, [selectedTop1]);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const res = await axiosInstance.get(`/categories`, {
          params: { group: selectedGroup },
        });
        if (res.data.isSuccess) {
          setMainCategories(res.data.result);
          setSelectedMainId(res.data.result[0]?.id ?? null);
        }
      } catch (err) {
        console.error('상위 카테고리 로딩 실패:', err);
      }
    };

    fetchMainCategories();
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedMainId === null) return;

    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get(`/categories/${selectedMainId}/subcategories`);
        if (res.data.isSuccess) {
          setSubCategories(res.data.result);
        }
      } catch (err) {
        console.error('하위 카테고리 로딩 실패:', err);
      }
    };

    fetchSubCategories();
  }, [selectedMainId]);

  const parsedSubCategories = subCategories.map(({ name }) => {
    const icon = CATEGORY_ICON_MAP[name] ?? ''; // 이모지가 없으면 빈 문자열
    return {
      label: name,
      icon,
    };
  });

  const handleSubCategoryClick = (name: string) => {
    navigate(`/search?keyword=${encodeURIComponent(name)}`);
  };

  return (
    <div className="text-body-regular flex flex-col min-h-screen">
      <header className="px-3">
        <Header />
      </header>

      {/* 전체 콘텐츠 영역 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-3">
          <PageButton items={['basic', 'industry']} selected={selectedTop1} onSelect={setSelectedTop1} />
        </div>

        <div className="flex flex-1 overflow-hidden px-3">
          {/* 왼쪽 사이드바 */}
          <ul className="w-[116px] h-full bg-gray-50 text-body-regular text-black-4 flex-shrink-0">
            {mainCategories.map(({ id, name }) => (
              <li
                key={id}
                onClick={() => setSelectedMainId(id)}
                className={`px-3 py-4 border-none cursor-pointer flex items-center justify-center ${
                  selectedMainId === id ? 'bg-white text-black font-semibold' : ''
                }`}
              >
                {name}
              </li>
            ))}
          </ul>

          {/* 오른쪽 하위 카테고리 */}
          <div className="relative flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.ul
                key={selectedMainId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white text-body-medium"
              >
                {parsedSubCategories.map(({ label, icon }) => (
                  <li
                    key={label}
                    onClick={() => handleSubCategoryClick(label)}
                    className="flex items-center justify-between py-3 px-4 border-none cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {icon && <span>{icon}</span>}
                      <span>{label}</span>
                    </div>
                    <img src={GoSearch} alt=">" className="w-4 h-4 opacity-60" />
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
