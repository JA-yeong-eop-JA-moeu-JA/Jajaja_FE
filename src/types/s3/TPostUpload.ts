import type { TCommonResponse } from '../common';

export type TPostUploadRequest = {
  fileName: string;
};

export type TPostUploadResponse = TCommonResponse<{
  url: string;
  keyName: string;
}>;
