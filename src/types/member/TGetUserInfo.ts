import type { TCommonResponse } from '@/types/common';

export type TGetUserInfoResponse = TCommonResponse<{
  id: number;
  name: string;
  profileUrl: string;
  phone: string;
  email: string;
}>;
