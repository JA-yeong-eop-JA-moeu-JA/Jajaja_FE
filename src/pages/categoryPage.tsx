import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { PageButton, type TabId } from '@/components/common/button';
import BottomBar from '@/components/head_bottom/BottomBar';

import Header from '../components/head_bottom/HomeHeader';
import { CATEGORY_DATA, CATEGORY_EMOJIS } from '../constants/categoryData';

import GoSearch from '@/assets/ChevronRight.svg';

{
  /** 라이브러리 추가 framer-motion */
}

export default function CategoryPage() {
  const [selectedTop1, setSelectedTop1] = useState<TabId>('basic');
  const navigate = useNavigate();

  const tabMap = {
    basic: '기본',
    industry: '업종별',
  } as const;

  const tabKey = tabMap[selectedTop1 as 'basic' | 'industry'];

  const mainCategories = Object.keys(CATEGORY_DATA[tabKey]);
  const [selectedMain, setSelectedMain] = useState<string>('');

  useEffect(() => {
    if (mainCategories.length > 0) {
      setSelectedMain(mainCategories[0]);
    }
  }, [tabKey]);

  const subCategories = CATEGORY_DATA[tabKey][selectedMain] ?? [];
  const parsedSubCategories = subCategories.map(({ name }) => {
    const parts = name.split(' ');
    const hasIcon = parts.length > 1 && CATEGORY_EMOJIS.has(parts[0]);
    const icon = hasIcon ? parts[0] : '';
    const label = hasIcon ? parts.slice(1).join(' ') : name;

    return { label, icon };
  });

  const handleSubCategoryClick = (name: string) => {
    navigate(`/search?keyword=${encodeURIComponent(name)}`);
  };

  return (
    <div>
      <header className="px-3">
        {/** 여백이 부족하여 추가했습니다 */}
        <Header />
      </header>

      <div className="flex flex-col pb-14 h-screen bg-white">
        <PageButton items={['basic', 'industry']} selected={selectedTop1} onSelect={setSelectedTop1} />

        <div className="flex flex-1 overflow-y-auto relative">
          <ul className="w-[116px] bg-gray-50 text-sm text-gray-400 flex-shrink-0">
            {mainCategories.map((main) => (
              <li
                key={main}
                onClick={() => setSelectedMain(main)}
                className={`px-3 py-4 border-none cursor-pointer flex items-center justify-center ${selectedMain === main ? 'bg-white text-black font-semibold' : ''}`}
              >
                {main}
              </li>
            ))}
          </ul>

          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.ul
                key={tabKey}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white text-sm"
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
        <BottomBar />
      </div>
    </div>
  );
}
