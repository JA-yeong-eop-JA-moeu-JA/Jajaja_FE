import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts';
import Agreement from '@/pages/agreement';
import Board from '@/pages/board';
import CategoryPage from '@/pages/categoryPage';
import ExchangeOK from '@/pages/feedback/exchangeOk';
import NotFound from '@/pages/feedback/NotFoundPage';
import ReturnOK from '@/pages/feedback/returnOk';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Address from '@/pages/mypage/address';
import MyDetailPage from '@/pages/mypage/myDetailPage';
import MyPage from '@/pages/mypage/myPage';
import Profile from '@/pages/mypage/profile';
import Notice from '@/pages/notice';
import OnBoarding from '@/pages/onBoarding';
import Payment from '@/pages/payment';
import PhotoReview from '@/pages/photoReview';
import Product from '@/pages/product';
import Review from '@/pages/review';
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
      { path: 'myPage/me', element: <MyDetailPage /> },
      { path: 'myPage/me/profile', element: <Profile /> },
      { path: 'myPage/me/address', element: <Address /> },
      { path: 'notice', element: <Notice /> },
      { path: 'payment', element: <Payment /> },
      { path: 'board', element: <Board /> },
      { path: 'agreement', element: <Agreement /> },
      { path: 'category', element: <CategoryPage /> },
      { path: 'search', element: <Search /> },
      { path: 'product/:id', element: <Product /> },
      { path: 'product/:id/photoReview', element: <PhotoReview /> },
      { path: 'product/:id/review', element: <Review /> },
      { path: 'exchange/complete', element: <ExchangeOK /> },
      { path: 'return/complete', element: <ReturnOK /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
