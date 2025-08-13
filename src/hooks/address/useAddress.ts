import type { IDeleteAddressRequest, IUpdateAddressRequest } from '@/types/address/TAddress';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import * as addressApi from '@/apis/address/address';

import { useCoreMutation, useCoreQuery } from '@/hooks/customQuery';

export const useGetAddresses = () => {
  return useCoreQuery(QUERY_KEYS.GET_ADDRESSES, () => addressApi.getAddresses(), {
    staleTime: 5 * 60 * 1000,
    select: (data) => data.data.result,
  });
};

export const useAddAddress = () => {
  return useCoreMutation(addressApi.addAddress, {
    onSuccess: () => {
      // 배송지 목록 재조회를 위한 캐시 무효화는 컴포넌트에서 처리
    },
  });
};

export const useUpdateAddress = () => {
  return useCoreMutation(({ addressId, request }: { addressId: number; request: IUpdateAddressRequest }) => addressApi.updateAddress(addressId, request), {
    onSuccess: () => {
      // 배송지 목록 재조회를 위한 캐시 무효화는 컴포넌트에서 처리
    },
  });
};

export const useDeleteAddress = () => {
  return useCoreMutation(({ addressId, request }: { addressId: number; request: IDeleteAddressRequest }) => addressApi.deleteAddress(addressId, request), {
    onSuccess: () => {
      // 배송지 목록 재조회를 위한 캐시 무효화는 컴포넌트에서 처리
    },
  });
};
