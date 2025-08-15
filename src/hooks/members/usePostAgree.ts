import { postAgree } from '@/apis/members/members';

import { useCoreMutation } from '../customQuery';

export default function usePostAgree() {
  const { mutate } = useCoreMutation(postAgree);
  return { mutate };
}
