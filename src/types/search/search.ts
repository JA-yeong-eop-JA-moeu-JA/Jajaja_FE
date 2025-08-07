import type { TCommonResponse } from '@/types/common';

export type TGetSearchKeyWord = TCommonResponse<{
  baseTime: string;
  keywords: string[];
}>;
