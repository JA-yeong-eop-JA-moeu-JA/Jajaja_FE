import { putUpload } from '@/apis/s3/s3';

import { useCoreMutation } from '../customQuery';

export default function usePutUpload() {
  const { mutateAsync } = useCoreMutation<void, { url: string; file: File }>(({ url, file }) => putUpload(url, file));

  return { mutateAsync };
}
