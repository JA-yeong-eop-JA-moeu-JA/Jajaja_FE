import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts';
import Home from '@/pages/home';
import Login from '@/pages/login';
import MyPage from '@/pages/myPage';
import Notice from '@/pages/notice';
import Payment from '@/pages/payment';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'myPage', element: <MyPage /> },
      { path: 'notice', element: <Notice /> },
      { path: 'payment', element: <Payment /> },
    ],
  },
]);
