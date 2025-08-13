import type { TPostUploadListRequest, TPostUploadListResponse } from '@/types/s3/TPostUpload';

import { postUploadList } from '@/apis/s3/s3';

import { useCoreMutation } from '@/hooks/customQuery';

export default function usePostUploadList() {
  const { mutateAsync } = useCoreMutation<TPostUploadListResponse, TPostUploadListRequest>(postUploadList);
  return { mutateAsync };
}
