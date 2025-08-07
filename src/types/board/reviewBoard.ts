export interface IReview {
  id: number;
  nickname: string;
  createDate: string;
  rating: number;
  option: string | null;
  content: string;
  likeCount: number;
  imagesCount: number;
}

export interface IReviewItem {
  review: IReview;
  isLike: boolean;
  imageUrls: string[];
}

export interface IReviewPageInfo {
  size: number;
  totalElements: number;
  currentElements: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLast: boolean;
}

export interface IReviewResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    page: IReviewPageInfo;
    reviews: IReviewItem[];
  };
}
