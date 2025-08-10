import type { TCommonResponse } from '../common';

export type TGetNotiUnread = TCommonResponse<{
  unreadCount: number;
}>;
