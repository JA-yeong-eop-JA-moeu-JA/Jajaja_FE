import { createContext, type PropsWithChildren, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import type { TGetUserInfoResponse } from '@/types/member/TGetUserInfo';

import useUserInfo from '@/hooks/members/useUserInfo';

interface IAuthContextType {
  user: TGetUserInfoResponse['result'] | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isError: boolean;
  refetch: ReturnType<typeof useUserInfo>['refetch'];
}

const AuthContext = createContext<IAuthContextType | null>(null);

const PROTECTED_PREFIXES = ['/mypage', '/notifications', '/payment', '/address', '/shoppingcart'];

export function AuthProvider({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const { data, isError, isLoading, refetch } = useUserInfo({ enabled: isProtected });

  const user = data?.result ?? null;
  const isLoggedIn = !!user;

  return <AuthContext.Provider value={{ user, isLoggedIn, isLoading, isError, refetch }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 안에서만 useAuth를 사용할 수 있습니다.');
  return context;
};
