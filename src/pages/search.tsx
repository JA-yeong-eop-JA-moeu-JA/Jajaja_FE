import 'react-indiana-drag-scroll/dist/style.css';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useSearchParams } from 'react-router-dom';

import type { TCategorySort } from '@/types/category';

import { formatKoreanDateLabel } from '@/utils/time';

// search 에 카테고리 api 연동을 위해서 추가, 수정 부분은 아이콘으로 표시 해뒀습니다!!
// ⭐ 추가
import { useCategoryProducts } from '@/hooks/category/useCategoryProduct';
import useDeleteRecent from '@/hooks/search/useDeleteRecent';
import useGetKeyword from '@/hooks/search/useGetKeyword';
import useGetRecent from '@/hooks/search/useGetRecent';
import { useKeywordProducts } from '@/hooks/search/useKeywordProduct';

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
  const [keywordParam, setKeyword] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState('인기순');
  const [change, setChange] = useState(false);
  const [inputValue, setValue] = useState('');

  const [isAsc, setIsAsc] = useState(true);

  const { data: recent } = useGetRecent();
  const { mutate } = useDeleteRecent();

  useEffect(() => {
    const keyword = new URLSearchParams(location.search).get('keyword');
    setKeyword(keyword);
  }, [location.search]);

  const COLUMN_COUNT = 2;
  const rowsPerColumn = data ? Math.ceil(data?.result.keywords.length / COLUMN_COUNT) : 0;
  const columns = Array.from({ length: COLUMN_COUNT }, (_, i) => data?.result.keywords.slice(i * rowsPerColumn, (i + 1) * rowsPerColumn));

  const subcategoryId = Number(searchParams.get('subcategoryId') || '');
  const isCategoryMode = !!subcategoryId;
  const SORT_LABEL_TO_ENUM: Record<string, TCategorySort> = {
    '인기순': 'POPULAR',
    '신상품순': 'NEW',
    '낮은 가격순': 'LOW_PRICE',
    '리뷰순': 'REVIEW',
  };

  const page = Number(searchParams.get('page') || '0');
  const size = searchParams.get('size') ? Number(searchParams.get('size')) : 20;
  const apiSort: TCategorySort = SORT_LABEL_TO_ENUM[sortOption] || 'NEW';

  const categoryQuery = useCategoryProducts({
    subcategoryId: isCategoryMode ? subcategoryId : undefined,
    sort: apiSort,
    page,
    size,
  });

  const keywordQuery = useKeywordProducts({
    keyword: !isCategoryMode ? keywordParam || '' : undefined,
    sort: apiSort,
    page,
    size,
  });

  type TProductCardItem = {
    id: number;
    name: string;
    price: number;
    discountRate: number;
    imageUrl: string;
    store?: string;
    rating?: number;
    reviewCount?: number;
    tag?: string;
  };

  const mapToProductCard = (p: any): TProductCardItem => ({
    id: p.productId ?? p.id,
    name: p.name ?? p.productName,
    price: p.salePrice ?? p.price,
    discountRate: p.discountRate ?? 0,
    imageUrl: p.imageUrl ?? p.thumbnailUrl,
    store: p.store,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tag: '',
  });

  const displayList: TProductCardItem[] = isCategoryMode ? categoryQuery.products.map(mapToProductCard) : keywordQuery.products.map(mapToProductCard);

  useEffect(() => {
    if (keywordParam) {
      setValue(keywordParam);
      setChange(true);
    }
    if (isCategoryMode) setChange(true);
  }, [keywordParam, isCategoryMode]);
  useEffect(() => {
    if (!isCategoryMode) return;
    const labelFromUrl = searchParams.get('keyword') || searchParams.get('subcategoryName');
    if (labelFromUrl) setValue(labelFromUrl);
  }, [isCategoryMode, searchParams]);

  const handleDelete = async (id: number) => mutate(id);

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleFilter = (value?: string) => {
    const keyword = (value ?? inputValue).trim();
    setChange(true);
    const qs = new URLSearchParams(searchParams);
    if (keyword) {
      qs.set('keyword', keyword);
      qs.delete('subcategoryId');
      qs.set('sort', apiSort);
    } else {
      qs.delete('keyword');
    }
    qs.set('page', '0');
    window.history.replaceState(null, '', `/search?${qs.toString()}`);
  };
  const handleSortSelect = (value?: string) => {
    if (value) {
      setSortOption(value);
      const qs = new URLSearchParams(searchParams);
      qs.set('sort', SORT_LABEL_TO_ENUM[value] || 'NEW');
      qs.set('page', '0');
      window.history.replaceState(null, '', `/search?${qs.toString()}`);
      setChange(true);
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

  // 로딩/에러 처리
  const isLoading = isCategoryMode ? categoryQuery.isLoading : keywordQuery.isLoading;
  const isError = isCategoryMode ? categoryQuery.isError : keywordQuery.isError;

  return (
    <>
      <header className="w-full pr-4 py-1 flex items-center">
        <Back onClick={() => window.history.back()} />
        <SearchInput value={inputValue} autoFocus onEnter={handleFilter} onChange={handleValue} onClick={() => handleFilter(inputValue)} />
      </header>

      {!change && (
        <section className="py-3 pl-5 flex flex-col gap-7">
          <section>
            <p className="text-subtitle-medium mb-2">최근 검색</p>
            <ScrollContainer className="flex w-full gap-2 overflow-x-auto cursor-grab pr-5" vertical={false}>
              {recent?.result.length === 0 && <p className="text-body-regular text-black-4 py-2.5">최근 검색어가 없습니다.</p>}
              {recent?.result.map(({ id, keyword }) => (
                <div key={id} className="shrink-0">
                  <Tag msg={keyword} onDelete={() => handleDelete(id)} />
                </div>
              ))}
            </ScrollContainer>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 pr-5">
              <p className="text-subtitle-medium">인기 검색어</p>
              <p className="text-small-medium text-black-4">{formatKoreanDateLabel(data?.result.baseTime)}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-x-6">
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-y-3">
                  {col?.map((item, id) => (
                    <div key={id} className="flex gap-2 items-center">
                      <p className="text-subtitle-medium text-green">{colIndex * (col?.length ?? 0) + id + 1}</p>
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

          {/* 로딩/에러/결과 */}
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-[calc(100vh-144px)]">
              <p className="text-subtitle-medium">로딩 중…</p>
            </div>
          ) : isError ? (
            <div className="w-full flex items-center justify-center h-[calc(100vh-144px)]">
              <p className="text-subtitle-medium text-error-3">불러오기에 실패했습니다.</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center h-[calc(100vh-144px)] gap-3">
              <NoResult />
              <p className="text-subtitle-medium">찾으시는 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5 items-center justify-center ">
              {displayList.map((item) => (
                <ProductCard
                  key={item.id}
                  {...{
                    ...item,
                    store: item.store ?? '',
                    rating: item.rating ?? 0,
                    reviewCount: item.reviewCount ?? 0,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
