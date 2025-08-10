import type { TPostUploadRequest, TPostUploadResponse } from '@/types/s3/TPostUpload';

import { postUpload } from '@/apis/s3/s3';

import { useCoreMutation } from '@/hooks/customQuery';

export default function usePostUpload() {
  const { mutateAsync } = useCoreMutation<TPostUploadResponse, TPostUploadRequest>(postUpload);
  return { mutateAsync };
}
