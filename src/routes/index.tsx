import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts';
import Board from '@/pages/board';
import CategoryPage from '@/pages/categoryPage';
import ExchangeOK from '@/pages/feedback/exchangeOk';
import NotFound from '@/pages/feedback/NotFoundPage';
import ReturnOK from '@/pages/feedback/returnOk';
import Home from '@/pages/home';
import Login from '@/pages/login';
import MyPage from '@/pages/myPage';
import Notice from '@/pages/notice';
import OnBoarding from '@/pages/onBoarding';
import Payment from '@/pages/payment';

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
      { path: 'category', element: <CategoryPage /> },
      { path: 'exchange/complete', element: <ExchangeOK /> },
      { path: 'return/complete', element: <ReturnOK /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
