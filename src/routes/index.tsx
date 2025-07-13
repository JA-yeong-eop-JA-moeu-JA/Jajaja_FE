import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts';
import AddAddress from '@/pages/addAddress';
import AddressChange from '@/pages/addressChange';
import Agreement from '@/pages/agreement';
import ApplyReturnOrExchange from '@/pages/ApplyReturnOrExchange';
import Board from '@/pages/board';
import CategoryPage from '@/pages/categoryPage';
<<<<<<< HEAD
import CouponsPage from '@/pages/coupon';
import DeliveryInfo from '@/pages/deliveryInfo';
import ExchangeOK from '@/pages/feedback/exchangeOk';
import NotFound from '@/pages/feedback/NotFoundPage';
import PaymentStatusWrapper from '@/pages/feedback/paymentStatusWrapper';
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
import OrderDetailPersonal from '@/pages/orderDetailPersonal';
import OrderDetailTeam from '@/pages/orderDetailTeam';
import OrderList from '@/pages/orderListPage';
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
      { path: 'mypage', element: <MyPage /> },
      { path: 'mypage/me', element: <MyDetailPage /> },
      { path: 'mypage/me/profile', element: <Profile /> },
      { path: 'mypage/me/address', element: <Address /> },
      { path: 'mypage/point', element: <Points /> },
      { path: 'mypage/coupon', element: <Coupons /> },
      { path: 'mypage/review', element: <MyReview /> },
      { path: 'mypage/review/:orderId/:productId', element: <WriteReview /> },
      { path: 'coupon', element: <CouponsPage /> },
      { path: 'notice', element: <Notice /> },
      { path: 'payment', element: <Payment /> },
      { path: 'shoppingcart', element: <ShoppingCart /> },
      { path: 'addresschange', element: <AddressChange /> },

      { path: 'search', element: <Search /> },
      { path: 'exchange/complete', element: <ExchangeOK /> },
      { path: 'return/complete', element: <ReturnOK /> },
      { path: 'addaddress', element: <AddAddress /> },
      { path: 'myPage/deliveryInfo', element: <DeliveryInfo /> },
      { path: 'myPage/order', element: <OrderList /> },
      { path: 'myPage/order/orderDetailPersonal', element: <OrderDetailPersonal /> },
      { path: 'myPage/order/orderDetailTeam', element: <OrderDetailTeam /> },
      { path: 'myPage/apply', element: <ApplyReturnOrExchange /> },

      { path: '*', element: <NotFound /> },
      { path: 'board', element: <Board /> },
      { path: 'agreement', element: <Agreement /> },
      { path: 'category', element: <CategoryPage /> },
      { path: 'search', element: <Search /> },
      { path: 'product/:id', element: <Product /> },
      { path: 'product/:id/photoReview', element: <PhotoReview /> },
      { path: 'product/:id/review', element: <Review /> },
      { path: 'payment/:status', element: <PaymentStatusWrapper /> },
      { path: 'exchange/complete', element: <ExchangeOK /> },
      { path: 'return/complete', element: <ReturnOK /> },
      { path: 'addaddress', element: <AddAddress /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
