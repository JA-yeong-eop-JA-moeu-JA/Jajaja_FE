import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { TPaymentData } from '@/types/cart/TCart';

import { joinTeamFromCart } from '@/apis/team/teamCart';

import { useCoreMutation } from '@/hooks/customQuery';

export const useTeamJoinFromCart = () => {
  const navigate = useNavigate();

  return useCoreMutation(joinTeamFromCart, {
    onSuccess: () => {
      toast.success('팀 매칭이 완료되었습니다! 곧 배송이 시작됩니다.'); // 모달로 수정

      // 팀 매칭 완료 시 장바구니에서 자동 제거됨
      const paymentData: TPaymentData = {
        orderType: 'team_join',
        selectedItems: [],
      };

      navigate('/payment', { state: paymentData });
    },
    onError: (error) => {
      console.error('Team join failed:', error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('팀 참여에 실패했습니다');
      }
    },
  });
};
