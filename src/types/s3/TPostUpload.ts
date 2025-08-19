import type { TCommonResponse } from '../common';

export type TPostUploadRequest = {
  fileName: string;
};

export type TUrlSet = {
  url: string;
  keyName: string;
};

export type TPostUploadResponse = TCommonResponse<TUrlSet>;

export type TPostUploadListRequest = {
  fileNameList: string[];
};

export type TPostUploadListResponse = TCommonResponse<{
  presignedUrlUploadResponses: TUrlSet[];
}>;
