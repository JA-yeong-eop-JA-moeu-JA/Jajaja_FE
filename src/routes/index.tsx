import { createBrowserRouter, Outlet } from 'react-router-dom';

import Layout from '@/layouts';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import RootLayout from '@/layouts/rootLayout';
import AddAddress from '@/pages/addAddress';
import AddressChange from '@/pages/addressChange';
import Agreement from '@/pages/agreement';
import ApplyReturnOrExchange from '@/pages/ApplyReturnOrExchange';
import Board from '@/pages/board';
import CategoryPage from '@/pages/categoryPage';
import CouponsPage from '@/pages/coupon';
import DeliveryInfo from '@/pages/deliveryInfo';
import EditAddress from '@/pages/editAddress';
import ExchangeOK from '@/pages/feedback/exchangeOk';
import NotFound from '@/pages/feedback/NotFoundPage';
import PaymentStatusWrapper from '@/pages/feedback/paymentStatusWrapper';
import ReturnOK from '@/pages/feedback/returnOk';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Coupons from '@/pages/mypage/coupons';
import MyDetailPage from '@/pages/mypage/myDetailPage';
import MyPage from '@/pages/mypage/myPage';
import MyReview from '@/pages/mypage/myReview';
import Points from '@/pages/mypage/points';
import Profile from '@/pages/mypage/profile';
import WriteReview from '@/pages/mypage/writeReview';
import Notifications from '@/pages/notifications';
import OnBoarding from '@/pages/onBoarding';
import OrderDetailPersonal from '@/pages/orderDetailPersonal';
import OrderList from '@/pages/orderListPage';
import Payment from '@/pages/payment';
import PhotoReview from '@/pages/photoReview';
import Product from '@/pages/product';
import Review from '@/pages/review';
import Search from '@/pages/search';
import ShoppingCart from '@/pages/shoppingCart';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
        children: [
          { index: true, element: <OnBoarding /> },
          { path: 'home', element: <Home /> },
          { path: 'login', element: <Login /> },
          { path: 'agreement', element: <Agreement /> },
          { path: 'coupon', element: <CouponsPage /> },
          { path: 'shoppingcart', element: <ShoppingCart /> },
          { path: 'board', element: <Board /> },
          { path: 'category', element: <CategoryPage /> },
          { path: 'product/:id', element: <Product /> },
          { path: 'product/:id/photoReview', element: <PhotoReview /> },
          { path: 'product/:id/review', element: <Review /> },
          { path: 'search', element: <Search /> },
          { path: 'notfound', element: <NotFound /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        path: '/',
        element: <ProtectedLayout />,
        children: [
          { path: 'mypage', element: <MyPage /> },
          { path: 'mypage/me', element: <MyDetailPage /> },
          { path: 'mypage/me/profile', element: <Profile /> },
          { path: 'mypage/point', element: <Points /> },
          { path: 'mypage/coupon', element: <Coupons /> },
          { path: 'mypage/review', element: <MyReview /> },
          { path: 'mypage/review/new', element: <WriteReview /> },
          { path: 'mypage/deliveryInfo', element: <DeliveryInfo /> },
          { path: 'mypage/order', element: <OrderList /> },
          { path: 'mypage/order/orderDetailPersonal', element: <OrderDetailPersonal /> },
          { path: 'mypage/apply', element: <ApplyReturnOrExchange /> },
          { path: 'mypage/order/exchange/complete', element: <ExchangeOK /> },
          { path: 'mypage/order/return/complete', element: <ReturnOK /> },
          { path: 'notifications', element: <Notifications /> },
          { path: 'payment', element: <Payment /> },
          { path: '/payment/confirm', element: <PaymentStatusWrapper /> },
          { path: '/payment/fail', element: <PaymentStatusWrapper /> },
          { path: 'address/change', element: <AddressChange /> },
          { path: 'address/edit', element: <EditAddress /> },
          { path: 'address/add', element: <AddAddress /> },
        ],
      },
    ],
  },
]);
