import 'react-indiana-drag-scroll/dist/style.css';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useSearchParams } from 'react-router-dom';

import type { TCategorySort } from '@/types/category';
import { TOTALLIST } from '@/constants/search/totalList';

import { formatKoreanDateLabel } from '@/utils/time';

// search 에 카테고리 api 연동을 위해서 추가, 수정 부분은 아이콘으로 표시 해뒀습니다!!
// ⭐ 추가
import { useCategoryProducts } from '@/hooks/category/useCategoryProduct';
import useDeleteRecent from '@/hooks/search/useDeleteRecent';
import useGetKeyword from '@/hooks/search/useGetKeyword';
import useGetRecent from '@/hooks/search/useGetRecent';

import SearchInput from '@/components/common/SearchInput';
import ProductCard from '@/components/home/productCard';
import Menu from '@/components/search/menu';
import Tag from '@/components/search/tag';

import Back from '@/assets/icons/back.svg?react';
import Down from '@/assets/icons/down.svg?react';
import NoResult from '@/assets/icons/noResult.svg?react';
import Up from '@/assets/icons/up.svg?react';

export default function Search() {
  const { data } = useGetKeyword();
  const [searchParams] = useSearchParams();
  const menuRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState('인기순');
  const [change, setChange] = useState(false);
  const [inputValue, setValue] = useState('');
  const [isAsc, setIsAsc] = useState(true);
  const [filteredList, setFilteredList] = useState(TOTALLIST);
  const { data: recent } = useGetRecent();
  const { mutate } = useDeleteRecent();
  const keywordParam = searchParams.get('keyword');
  const COLUMN_COUNT = 2;
  const rowsPerColumn = data ? Math.ceil(data?.result.keywords.length / COLUMN_COUNT) : 0;
  const columns = Array.from({ length: COLUMN_COUNT }, (_, i) => data?.result.keywords.slice(i * rowsPerColumn, (i + 1) * rowsPerColumn));

  // ⭐ 추가: 카테고리 모드 감지 & 라벨↔ENUM 매핑
  const subcategoryId = Number(searchParams.get('subcategoryId') || '');
  const isCategoryMode = !!subcategoryId;
  const SORT_LABEL_TO_ENUM: Record<string, TCategorySort> = {
    '인기순': 'POPULAR',
    '신상품순': 'NEW',
    '낮은 가격순': 'PRICE_ASC',
    '리뷰순': 'REVIEW',
  };
  //const displayList = isCategoryMode
  //  ? categoryProducts.map(mapToProductCard)
  //  : filteredList;

  // ⭐ 추가: page/size 읽기 + API 정렬 값 + 카테고리 상품 조회
  const page = Number(searchParams.get('page') || '0');
  const size = Number(searchParams.get('size') || '20');
  const apiSort: TCategorySort = SORT_LABEL_TO_ENUM[sortOption] || 'NEW';
  const { products: categoryProducts } = useCategoryProducts({
    subcategoryId: isCategoryMode ? subcategoryId : undefined,
    sort: apiSort,
    page,
    size,
  });
  // ⭐ 추가: API → ProductCard/TOTALLIST 아이템으로 매핑
  type TProductCardItem = (typeof TOTALLIST)[number];

  const mapToProductCard = (p: any): TProductCardItem => ({
    id: p.productId,
    name: p.name,
    price: p.salePrice,
    discountRate: p.discountRate,
    imageUrl: p.imageUrl,
    store: p.store,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tag: '',
  });

  // ⭐ 추가: 카테고리 모드일 때 filteredList에 API 결과 주입
  useEffect(() => {
    if (isCategoryMode && categoryProducts) {
      setFilteredList(categoryProducts.map(mapToProductCard));
      setChange(true);
    }
  }, [isCategoryMode, categoryProducts]);
  // ⭐ 추가: 카테고리 모드일 때 URL 검색어 초기화
  useEffect(() => {
    if (!isCategoryMode) return;
    const labelFromUrl = searchParams.get('keyword') || searchParams.get('subcategoryName');
    if (labelFromUrl) setValue(labelFromUrl); // 표시만 함, handleFilter는 호출 X
  }, [isCategoryMode, searchParams]);

  const handleDelete = (id: number) => {
    mutate(id);
  };
  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleFilter = (value?: string) => {
    setChange(true);
    const keyword = value ?? inputValue;

    if (!keyword.trim()) {
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
  // ❗ 수정: 카테고리 모드일 때 URL sort 변경 + change 상태 유지
  const handleSortSelect = (value?: string) => {
    if (value) {
      setSortOption(value);
      if (isCategoryMode) {
        const qs = new URLSearchParams(searchParams);
        qs.set('sort', SORT_LABEL_TO_ENUM[value] || 'NEW');
        qs.set('page', '0');
        window.history.replaceState(null, '', `/search?${qs.toString()}`);
      }
    }
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
    // ⭐ 추가: 카테고리 모드면 바로 change=true
    if (isCategoryMode) {
      setChange(true);
    }
  }, [keywordParam, isCategoryMode]);
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
              {!data?.result.keywords.length && <p className="text-body-regular text-black-4 py-2.5">최근 검색어가 없습니다.</p>}
              {recent?.result.map(({ id, keyword }) => (
                <div key={id} className="shrink-0">
                  <Tag msg={keyword} onDelete={() => handleDelete(id)} />
                </div>
              ))}
            </ScrollContainer>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-subtitle-medium">인기 검색어</p>
              <p className="text-small-medium text-black-4">{formatKoreanDateLabel(data?.result.baseTime)}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-x-6">
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-y-3">
                  {col?.map((item, id) => (
                    <div key={id} className="flex gap-2 items-center">
                      <p className="text-subtitle-medium text-green">{colIndex * col.length + id + 1}</p>
                      <p className="text-body-regular">{item}</p>
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
              {isAsc ? <Down className="w-3.5 h-2" /> : <Up />}
            </div>

            {!isAsc && (
              <div className="absolute top-full right-0">
                <Menu selected={sortOption} onSelect={handleSortSelect} />
              </div>
            )}
          </div>

          {/* ❗ 수정안함: filteredList → displayList 고려해봐야함 */}
          {filteredList.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center h-[calc(100vh-144px)] gap-3">
              <NoResult />
              <p className="text-subtitle-medium">찾으시는 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5 items-center justify-center ">
              {filteredList.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
