import { patchNotiReadAll } from '@/apis/notifications/notifications';

import { useCoreMutation } from '../customQuery';

export default function usePatchNotiReadAll() {
  const { mutate } = useCoreMutation(patchNotiReadAll);
  return { mutate };
}
