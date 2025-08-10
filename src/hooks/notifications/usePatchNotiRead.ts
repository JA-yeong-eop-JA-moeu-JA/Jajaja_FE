import { patchNotiRead } from '@/apis/notifications/notifications';

import { useCoreMutation } from '../customQuery';

export default function usePatchNotiRead() {
  const { mutate } = useCoreMutation(patchNotiRead);
  return { mutate };
}
