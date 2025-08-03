import { createContext, type PropsWithChildren, useContext } from 'react';

import type { TGetUserInfoResponse } from '@/types/member/TGetUserInfo';

import useUserInfo from '@/hooks/myPage/useUserInfo';

interface IAuthContextType {
  user: TGetUserInfoResponse['result'] | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<IAuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { data } = useUserInfo();

  const user = data?.result ?? null;
  const isLoggedIn = !!user;
  const isLoading = data === undefined;

  return <AuthContext.Provider value={{ user, isLoggedIn, isLoading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 안에서만 useAuth를 사용할 수 있습니다.');
  return context;
};
