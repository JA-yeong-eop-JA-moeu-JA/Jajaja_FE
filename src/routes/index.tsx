import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts';
import Board from '@/pages/board';
import Agreement from '@/pages/agreement';
import CategoryPage from '@/pages/categoryPage';
import ExchangeOK from '@/pages/feedback/exchangeOk';
import NotFound from '@/pages/feedback/NotFoundPage';
import ReturnOK from '@/pages/feedback/returnOk';
import Home from '@/pages/home';
import Login from '@/pages/login';
import MyPage from '@/pages/mypage/myPage';
import Notice from '@/pages/notice';
import OnBoarding from '@/pages/onBoarding';
import Payment from '@/pages/payment';
import Search from '@/pages/search';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <OnBoarding /> },
      { path: 'home', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'myPage', element: <MyPage /> },
      { path: 'notice', element: <Notice /> },
      { path: 'payment', element: <Payment /> },
      { path: 'board', element: <Board /> },
      { path: 'agreement', element: <Agreement /> },
      { path: 'category', element: <CategoryPage /> },
      { path: 'search', element: <Search /> },
      { path: 'exchange/complete', element: <ExchangeOK /> },
      { path: 'return/complete', element: <ReturnOK /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
