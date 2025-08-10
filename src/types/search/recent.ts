import type { TCommonResponse } from '@/types/common';

export type TGetRecent = TCommonResponse<
  {
    id: number;
    keyword: string;
  }[]
>;
