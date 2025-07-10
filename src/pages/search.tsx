import 'react-indiana-drag-scroll/dist/style.css';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useSearchParams } from 'react-router-dom';

import { SEARCHWORD } from '@/constants/search/searchWord';
import { TOTALLIST } from '@/constants/search/totalList';

import SearchInput from '@/components/common/SearchInput';
import ProductCard from '@/components/home/productCard';
import Menu from '@/components/search/menu';
import Tag from '@/components/search/tag';

import Back from '@/assets/icons/back.svg?react';
import Down from '@/assets/icons/down.svg?react';
import NoResult from '@/assets/icons/noResult.svg?react';
import Up from '@/assets/icons/up.svg?react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const menuRef = useRef<HTMLDivElement>(null);
  const [filteredWords, setFilteredWords] = useState(SEARCHWORD);
  const [sortOption, setSortOption] = useState('인기순');
  const [change, setChange] = useState(false);
  const [inputValue, setValue] = useState('');
  const [isAsc, setIsAsc] = useState(true);
  const [filteredList, setFilteredList] = useState(TOTALLIST);
  const keywordParam = searchParams.get('keyword');
  const COLUMN_COUNT = 2;
  const rowsPerColumn = Math.ceil(SEARCHWORD.length / COLUMN_COUNT);
  const columns = Array.from({ length: COLUMN_COUNT }, (_, i) => SEARCHWORD.slice(i * rowsPerColumn, (i + 1) * rowsPerColumn));
  const handleDelete = (id: number) => {
    setFilteredWords((prev) => prev.filter((word) => word.id !== id));
  };
  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
<<<<<<< HEAD
  const handleFilter = (value?: string) => {
    setChange(true);
    const keyword = value ?? inputValue;

    if (!keyword.trim()) {
=======
  const handleFilter = () => {
    setChange(true);
    if (!inputValue.trim()) {
>>>>>>> dd1758b6451098a642b45b9cda1a410892e68a2c
      setFilteredList(TOTALLIST);
      return;
    }
    const matchIndex = TOTALLIST.findIndex((item) => item.name.includes(keyword));
    if (matchIndex !== -1) {
      const matched = TOTALLIST[matchIndex];
      const rest = [...TOTALLIST.slice(0, matchIndex), ...TOTALLIST.slice(matchIndex + 1)];
      setFilteredList([matched, ...rest]);
    } else {
      setFilteredList([]);
    }
  };
  const handleSortSelect = (value?: string) => {
    if (value) setSortOption(value);
    setIsAsc(true);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAsc(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (keywordParam) {
      setValue(keywordParam);
      setChange(true);
      handleFilter(keywordParam);
    }
  }, [keywordParam]);
  return (
    <>
      <header className="w-full pr-4 py-1 flex items-center">
        <Back onClick={() => window.history.back()} />
        <SearchInput value={inputValue} autoFocus onEnter={handleFilter} onChange={handleValue} onClick={handleFilter} />
      </header>
      {!change && (
        <section className="py-3 px-5 flex flex-col gap-7">
          <section>
            <p className="text-subtitle-medium mb-2">최근 검색</p>
            <ScrollContainer className="flex w-full gap-2 overflow-x-auto cursor-grab" vertical={false}>
              {!filteredWords.length && <p className="text-body-regular text-black-4 py-2.5">최근 검색어가 없습니다.</p>}
              {filteredWords.map(({ id, name }) => (
                <div key={id} className="shrink-0">
                  <Tag msg={name} onDelete={() => handleDelete(id)} />
                </div>
              ))}
            </ScrollContainer>
          </section>
          <section>
            <div className="flex items-end justify-between mb-4">
              <p className="text-subtitle-medium">인기 검색어</p>
              <p className="text-small-medium text-black-4">07.24. 10:00 기준</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-x-6">
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-y-3">
                  {col.map(({ id, name }) => (
                    <div key={id} className="flex gap-2 items-center">
                      <p className="text-subtitle-medium text-green">{id}</p>
                      <p className="text-body-regular">{name}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </section>
      )}
      {change && (
        <section className="w-full px-4 pb-7">
          <div ref={menuRef} className="py-4 relative w-fit ml-auto text-small-medium">
            <div onClick={() => setIsAsc((prev) => !prev)} className="flex items-center gap-2 cursor-pointer">
              <p>{sortOption}</p>
              {isAsc ? <Down /> : <Up />}
            </div>

            {!isAsc && (
              <div className="absolute top-full right-0">
                <Menu selected={sortOption} onSelect={handleSortSelect} />
              </div>
            )}
          </div>
          {filteredList.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center h-[calc(100vh-144px)] gap-3">
              <NoResult />
              <p className="text-subtitle-medium">찾으시는 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5 items-center justify-center ">
              {filteredList.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
