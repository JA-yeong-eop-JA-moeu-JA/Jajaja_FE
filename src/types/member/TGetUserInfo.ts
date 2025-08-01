import type { TCommonResponse } from '@/types/common';

export type TGetUserInfoResponse = TCommonResponse<{
  id: 0;
  name: string;
  profileUrl: string;
  phone: string;
  email: string;
}>;
