import 'react-indiana-drag-scroll/dist/style.css';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import type { TCategorySort } from '@/types/category';

import Storage from '@/utils/storage';
import { formatKoreanDateLabel } from '@/utils/time';

import { useCategoryProducts } from '@/hooks/category/useCategoryProduct';
import useInfiniteObserver from '@/hooks/common/useInfiniteObserver';
import useDeleteRecent from '@/hooks/search/useDeleteRecent';
import useGetKeyword from '@/hooks/search/useGetKeyword';
import useGetRecent from '@/hooks/search/useGetRecent';
import { useKeywordProducts } from '@/hooks/search/useKeywordProduct';

import InfiniteScrollSentinel from '@/components/common/infiniteScroll';
import SearchInput from '@/components/common/SearchInput';
import ProductCard from '@/components/home/productCard';
import Menu from '@/components/search/menu';
import Tag from '@/components/search/tag';

import Back from '@/assets/icons/back.svg?react';
import Down from '@/assets/icons/down.svg?react';
import Up from '@/assets/icons/up.svg?react';

export default function Search() {
  type TKeywordItem = {
    id: number;
    keyword: string;
  };
  const { data } = useGetKeyword();
  const [searchParams, setSearchParams] = useSearchParams();
  const menuRef = useRef<HTMLDivElement>(null);
  const [keywordParam, setKeyword] = useState<string | null>(null);
  const [sort, setSort] = useState<TCategorySort>((searchParams.get('sort') as TCategorySort) || 'NEW');
  const [sortOption, setSortOption] = useState('인기순');
  const [change, setChange] = useState(false);
  const [inputValue, setValue] = useState('');
  const [isAsc, setIsAsc] = useState(true);
  const { search } = useLocation();
  const [localKeywords, setLocalKeywords] = useState<TKeywordItem[]>(() => Storage.getKeyword());

  const PAGE_SIZE = 6;
  const navigate = useNavigate();
  const { data: recent } = useGetRecent();
  const { mutate } = useDeleteRecent();

  useEffect(() => {
    const keyword = new URLSearchParams(location.search).get('keyword');
    setKeyword(keyword);
  }, [search]);

  const COLUMN_COUNT = 2;
  const rowsPerColumn = data ? Math.ceil(data?.result.keywords.length / COLUMN_COUNT) : 0;
  const columns = Array.from({ length: COLUMN_COUNT }, (_, i) => data?.result.keywords.slice(i * rowsPerColumn, (i + 1) * rowsPerColumn));

  const subcategoryId = Number(searchParams.get('subcategoryId') || '');
  const isCategoryMode = !!subcategoryId;

  const SORT_ENUM_TO_LABEL: Record<TCategorySort, string> = {
    POPULAR: '인기순',
    NEW: '신상품순',
    PRICE_ASC: '낮은 가격 순',
    REVIEW: '리뷰 많은 순',
  };

  const labelToEnum = (label: string): TCategorySort => {
    const s = label.replace(/\s/g, '');
    if (s.includes('인기')) return 'POPULAR';
    if (s.includes('신상품') || s.includes('최신')) return 'NEW';
    if (s.includes('낮은')) return 'PRICE_ASC';
    if (s.includes('리뷰')) return 'REVIEW';
    return 'NEW';
  };

  const page = Number(searchParams.get('page') || '0');
  const size = searchParams.get('size') ? Number(searchParams.get('size')) : PAGE_SIZE;

  const categoryQuery = useCategoryProducts({
    subcategoryId: isCategoryMode ? subcategoryId : undefined,
    sort,
    page,
    size,
  });

  const {
    data: q,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useKeywordProducts({
    keyword: !isCategoryMode ? keywordParam || '' : undefined,
    sort,
    page,
    size,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 0.2 },
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, sort]);
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

  const [accCategory, setAccCategory] = useState<TProductCardItem[]>([]);

  useEffect(() => {
    if (!isCategoryMode) return;
    const cur = (categoryQuery.products ?? []).map(mapToProductCard);
    setAccCategory((prev) => (page === 0 ? cur : [...prev, ...cur]));
  }, [isCategoryMode, categoryQuery.products, page]);

  useEffect(() => {
    if (!isCategoryMode) {
      setAccCategory([]);
      return;
    }
  }, [isCategoryMode, subcategoryId, sort]);

  const pageInfo = categoryQuery?.pageInfo;
  const hasNextCategory = pageInfo ? (pageInfo.hasNextPage ?? !pageInfo.isLast) : (categoryQuery?.products?.length ?? 0) === size;

  const enableInfiniteCategory = isCategoryMode && hasNextCategory && !categoryQuery.isLoading && accCategory.length >= size;

  const categorySentinelRef = useInfiniteObserver({
    enabled: enableInfiniteCategory,
    onIntersect: () => {
      const qs = new URLSearchParams(searchParams);
      const cur = Number(qs.get('page') || '0');
      qs.set('page', String(cur + 1));
      qs.set('size', String(PAGE_SIZE)); // ★ 유지
      setSearchParams(qs, { replace: true });
    },
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });

  const displayList: TProductCardItem[] = isCategoryMode ? accCategory : (q?.pages.flatMap((p) => p.result.products) ?? []).map(mapToProductCard);

  useEffect(() => {
    if (!searchParams.get('size')) {
      const qs = new URLSearchParams(searchParams);
      qs.set('size', String(PAGE_SIZE));
      setSearchParams(qs, { replace: true });
    }
  }, []);

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

  useEffect(() => {
    const s = (searchParams.get('sort') as TCategorySort) || 'NEW';
    if (s !== sort) setSort(s);

    const label = SORT_ENUM_TO_LABEL[s] ?? '신상품순';
    if (label !== sortOption) setSortOption(label);
  }, [searchParams]);

  const keywordExist = Storage.getKeyword().length > 0 || (recent && recent.result.length > 0);
  const isLocalData = !recent || recent.result.length === 0;
  const keywordData = isLocalData ? localKeywords : recent!.result;

  const handleDelete = async (id: number) => {
    if (isLocalData) {
      Storage.deleteKeyword(id);
      setLocalKeywords((prev) => prev.filter((item) => item.id !== id));
    } else {
      await mutate(id);
    }
  };

  useEffect(() => {
    if (isLocalData) {
      setLocalKeywords(Storage.getKeyword());
    }
  }, [isLocalData, recent]);

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleFilter = (value?: string) => {
    const keyword = (value ?? inputValue).trim();
    setChange(true);
    const qs = new URLSearchParams(searchParams);
    if (keyword) {
      qs.set('keyword', keyword);
      qs.delete('subcategoryId');
      qs.set('sort', sort);
    } else {
      qs.delete('keyword');
    }
    qs.set('page', '0');
    qs.set('size', String(PAGE_SIZE)); // ★ 추가
    Storage.setKeyword(keyword);
    setSearchParams(qs, { replace: true });
    setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 0);
  };

  const handleSortSelect = (value?: string) => {
    if (!value) return;
    setSortOption(value);

    const nextSort = labelToEnum(value);
    setSort(nextSort);
    const qs = new URLSearchParams(searchParams);
    qs.set('sort', nextSort);
    qs.set('page', '0');
    qs.set('size', String(PAGE_SIZE)); // ★ 추가
    setSearchParams(qs, { replace: true });
    setIsAsc(true);
    setChange(true);
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

  const hasKeyword = new URLSearchParams(search).has('keyword');
  const handleNavigate = () => {
    if (hasKeyword) {
      window.location.replace('/search');
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <header className="w-full pr-4 py-1 flex items-center">
        <Back onClick={handleNavigate} />
        <SearchInput value={inputValue} autoFocus={!change} onChange={handleValue} onEnter={handleFilter} onClick={handleFilter} />
      </header>

      {!change && (
        <section className="py-3 pl-5 flex flex-col gap-7">
          <section>
            <p className="text-subtitle-medium mb-2">최근 검색</p>
            <ScrollContainer className="flex w-full gap-2 overflow-x-auto cursor-grab pr-5" vertical={false}>
              {!keywordExist && <p className="text-body-regular text-black-4 py-2.5">최근 검색어가 없습니다.</p>}
              {keywordData?.map(({ id, keyword }) => (
                <div key={id} className="shrink-0" onClick={() => handleFilter(keyword)}>
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
        <section className="w-full px-4 pb-10">
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
          {isCategoryMode ? <InfiniteScrollSentinel ref={categorySentinelRef} style={{ height: 1 }} /> : <div ref={bottomRef} className="h-1" />}
          {(isLoading || categoryQuery.isLoading) && (
            <div className="w-full flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-15 w-15 border-3 border-t-transparent border-orange-light-active" />
            </div>
          )}
        </section>
      )}
    </>
  );
}
