import type { TPostUploadListRequest, TPostUploadListResponse, TPostUploadRequest, TPostUploadResponse } from '@/types/s3/TPostUpload';

import { axiosInstance } from '../axiosInstance';

export const postUpload = async (file: TPostUploadRequest): Promise<TPostUploadResponse> => {
  const { data } = await axiosInstance.post(`/api/s3/presigned/upload`, file);
  return data;
};

export const postUploadList = async (fileNameList: TPostUploadListRequest): Promise<TPostUploadListResponse> => {
  const { data } = await axiosInstance.post(`/api/s3/presigned/upload/list`, fileNameList);
  return data;
};

export const putUpload = async (url: string, file: File): Promise<void> => {
  await axiosInstance.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};
