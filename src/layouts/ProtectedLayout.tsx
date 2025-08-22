import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Loading from '@/components/loading';

import Layout from '.';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading, isError } = useAuth();
  useEffect(() => {
    if (isLoggedIn) {
      import('@/pages/mypage/myPage');
    }
  }, [isLoggedIn]);

  return (
    <Layout>
      {isLoading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      ) : !isError && isLoggedIn ? (
        <Outlet />
      ) : (
        <div className="h-screen" />
      )}
    </Layout>
  );
}
