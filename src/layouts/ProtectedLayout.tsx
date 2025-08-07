import { Navigate, Outlet } from 'react-router-dom';

import Layout from '.';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <div>로딩 중...</div>;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
