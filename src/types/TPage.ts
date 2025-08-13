export type TPage = {
  size: number;
  totalElements: number;
  currentElements: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLast: boolean;
};

export type TInfiniteRequest = {
  page: number;
  size: number;
};
