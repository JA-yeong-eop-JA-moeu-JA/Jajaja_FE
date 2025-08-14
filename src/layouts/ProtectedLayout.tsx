import { Outlet } from 'react-router-dom';

import Loading from '@/components/loading';

import Layout from '.';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading, isError } = useAuth();
  return (
    <Layout>
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
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
