export type TReviewItem = {
  review: {
    id: number;
    nickname: string;
    profileUrl: string;
    createDate: string;
    rating: number;
    productName: string;
    option: string;
    content: string;
    likeCount: number;
    imagesCount: number;
  };
  isLike: boolean;
  imageUrls: string[];
};

export type TReviewPage = {
  size: number;
  totalElements: number;
  currentElements: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLast: boolean;
};

export type TGetReviewsSuccess = {
  isSuccess: true;
  code: 'COMMON200';
  message: string;
  result: {
    page: TReviewPage;
    reviews: TReviewItem[];
  };
};

export type TGetReviewsFail = { isSuccess: false; code: 'REVIEW4001'; message: string } | { isSuccess: false; code: string; message: string };

export type TGetReviewsResponse = TGetReviewsSuccess | TGetReviewsFail;

export type TReviewSort = 'LATEST' | 'RECOMMEND';
