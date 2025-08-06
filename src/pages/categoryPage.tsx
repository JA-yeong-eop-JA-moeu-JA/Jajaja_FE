import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { PageButton, type TabId } from '@/components/common/button';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';

import GoSearch from '@/assets/ChevronRight.svg';
import { CATEGORY_ICON_MAP } from '@/constants/category/categoryIcon';
import { useCategory } from '@/hooks/category/useCategory';

export default function CategoryPage() {
  const [selectedTop1, setSelectedTop1] = useState<TabId>('basic');
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);

  const selectedGroup = selectedTop1 === 'basic' ? 'DEFAULT' : 'BUSINESS';
  const { mainCategories, subCategories } = useCategory(selectedGroup, selectedMainId);

  useEffect(() => {
    if (mainCategories.length > 0) {
      setSelectedMainId(mainCategories[0].id);
    }
  }, [mainCategories]);

  const navigate = useNavigate();

  const parsedSubCategories = subCategories.map(({ name }) => ({
    label: name,
    icon: CATEGORY_ICON_MAP[name] ?? '',
  }));

  const handleSubCategoryClick = (name: string) => {
    navigate(`/search?keyword=${encodeURIComponent(name)}`);
  };

  return (
    <div className="text-body-regular flex flex-col min-h-screen">
      <header className="px-3">
        <Header />
      </header>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-3">
          <PageButton items={['basic', 'industry']} selected={selectedTop1} onSelect={setSelectedTop1} />
        </div>

        <div className="flex flex-1 overflow-hidden px-3">
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
