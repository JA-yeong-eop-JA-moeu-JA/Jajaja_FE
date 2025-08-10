import type { TTeamRequest, TTeamResponse } from '@/types/product/makeTeam';

import { axiosInstance } from '@/apis/axiosInstance';

export const makeTeam = async ({ productId }: TTeamRequest): Promise<TTeamResponse> => {
<<<<<<< HEAD
  const { data } = await axiosInstance.patch(`/api/reviews/${productId}`);
=======
  const { data } = await axiosInstance.post(`/api/teams/${productId}`);
>>>>>>> 35d2fa690a1b38639e4024b3c18395c5cfd32560
  return data;
};
