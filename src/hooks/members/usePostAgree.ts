import Storage from '@/utils/storage';
import { postAgree } from '@/apis/members/members';

import useCategory from '@/hooks/onBoarding/useCategory';

import { useCoreMutation } from '../customQuery';

export default function usePostAgree() {
  const { mutate: setCategory } = useCategory();
  const { mutate } = useCoreMutation(postAgree, {
    onSuccess: () => {
      if (Storage.getCategory()) {
        setCategory({ businessCategoryId: Number(Storage.getCategory()) });
      }
    },
  });
  return { mutate };
}
