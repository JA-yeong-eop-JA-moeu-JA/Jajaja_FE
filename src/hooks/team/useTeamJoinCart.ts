import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { TPaymentData, TPaymentItem } from '@/types/cart/TCart';

import { joinTeamFromCart } from '@/apis/team/teamCart';

import { useCoreMutation } from '@/hooks/customQuery';

interface ITeamJoinFromCartParams {
  productId: number;
  selectedItems: TPaymentItem[];
}

export const useTeamJoinFromCart = () => {
  const navigate = useNavigate();

  return useCoreMutation((params: ITeamJoinFromCartParams) => joinTeamFromCart(params.productId), {
    onSuccess: (_data, variables) => {
      const { selectedItems } = variables as ITeamJoinFromCartParams;

      toast.success('팀에 참여했습니다! 결제를 진행해주세요.');

      const paymentData: TPaymentData = {
        orderType: 'team_join',
        selectedItems: selectedItems,
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
