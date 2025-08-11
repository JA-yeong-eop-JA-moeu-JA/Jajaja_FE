import { Navigate, Outlet } from 'react-router-dom';

import Loading from '@/components/loading';

import Layout from '.';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
