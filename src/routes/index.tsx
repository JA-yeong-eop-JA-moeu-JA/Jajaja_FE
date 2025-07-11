import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts';
import AddAddress from '@/pages/addAddress';
import Agreement from '@/pages/agreement';
import Board from '@/pages/board';
import CategoryPage from '@/pages/categoryPage';
<<<<<<< HEAD
import CouponsPage from '@/pages/coupon';
=======
>>>>>>> 3e03a1d (fix: 라우팅 수정)
import ExchangeOK from '@/pages/feedback/exchangeOk';
import NotFound from '@/pages/feedback/NotFoundPage';
import PaymentStatusWrapper from '@/pages/feedback/paymentStatusWrapper';
import ReturnOK from '@/pages/feedback/returnOk';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Address from '@/pages/mypage/address';
import Coupons from '@/pages/mypage/coupons';
import MyDetailPage from '@/pages/mypage/myDetailPage';
import MyPage from '@/pages/mypage/myPage';
import MyReview from '@/pages/mypage/myReview';
import Points from '@/pages/mypage/points';
import Profile from '@/pages/mypage/profile';
import WriteReview from '@/pages/mypage/writeReview';
import Notice from '@/pages/notice';
import OnBoarding from '@/pages/onBoarding';
import Payment from '@/pages/payment';
import PhotoReview from '@/pages/photoReview';
import Product from '@/pages/product';
import Review from '@/pages/review';
import Search from '@/pages/search';
import ShoppingCart from '@/pages/shoppingCart';

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
      { path: 'myPage/point', element: <Points /> },
      { path: 'myPage/coupon', element: <Coupons /> },
      { path: 'myPage/review', element: <MyReview /> },
      { path: 'myPage/review/:orderId/:productId', element: <WriteReview /> },
      { path: 'coupon', element: <CouponsPage /> },
      { path: 'notice', element: <Notice /> },
      { path: 'payment', element: <Payment /> },
      { path: 'shoppingcart', element: <ShoppingCart /> },

      { path: 'search', element: <Search /> },
      { path: 'exchange/complete', element: <ExchangeOK /> },
      { path: 'return/complete', element: <ReturnOK /> },
      { path: 'addaddress', element: <AddAddress /> },
      { path: '*', element: <NotFound /> },
      { path: 'board', element: <Board /> },
      { path: 'agreement', element: <Agreement /> },
      { path: 'category', element: <CategoryPage /> },
      { path: 'search', element: <Search /> },
      { path: 'product/:id', element: <Product /> },
      { path: 'product/:id/photoReview', element: <PhotoReview /> },
      { path: 'product/:id/review', element: <Review /> },
      { path: 'payment/:status', element: <PaymentStatusWrapper /> },
      { path: 'shoppingcart', element: <ShoppingCart /> },
    ],
  },
]);
