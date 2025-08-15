import { createBrowserRouter, Outlet } from 'react-router-dom';

import Layout from '@/layouts';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import RootLayout from '@/layouts/rootLayout';
import Agreement from '@/pages/agreement';
import Home from '@/pages/home';
import Login from '@/pages/login';
import OnBoarding from '@/pages/onBoarding';

const lazyRoute = (loader: () => Promise<any>) => {
  return async () => {
    const mod = await loader();
    return { Component: mod.default };
  };
};

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
          { path: 'coupon', lazy: lazyRoute(() => import('@/pages/coupon')) },
          { path: 'shoppingcart', lazy: lazyRoute(() => import('@/pages/shoppingCart')) },
          { path: 'board', lazy: lazyRoute(() => import('@/pages/board')) },
          { path: 'category', lazy: lazyRoute(() => import('@/pages/categoryPage')) },
          { path: 'product/:id', lazy: lazyRoute(() => import('@/pages/product')) },
          { path: 'product/:id/photoReview', lazy: lazyRoute(() => import('@/pages/photoReview')) },
          { path: 'product/:id/review', lazy: lazyRoute(() => import('@/pages/review')) },
          { path: 'search', lazy: lazyRoute(() => import('@/pages/search')) },
          { path: 'notfound', lazy: lazyRoute(() => import('@/pages/feedback/NotFoundPage')) },
          { path: '*', lazy: lazyRoute(() => import('@/pages/feedback/NotFoundPage')) },
        ],
      },
      {
        path: '/',
        element: <ProtectedLayout />,
        children: [
          { path: 'mypage', lazy: lazyRoute(() => import('@/pages/mypage/myPage')) },
          { path: 'mypage/me', lazy: lazyRoute(() => import('@/pages/mypage/myDetailPage')) },
          { path: 'mypage/me/profile', lazy: lazyRoute(() => import('@/pages/mypage/profile')) },
          { path: 'mypage/point', lazy: lazyRoute(() => import('@/pages/mypage/points')) },
          { path: 'mypage/coupon', lazy: lazyRoute(() => import('@/pages/mypage/coupons')) },
          { path: 'mypage/review', lazy: lazyRoute(() => import('@/pages/mypage/myReview')) },
          { path: 'mypage/review/new', lazy: lazyRoute(() => import('@/pages/mypage/writeReview')) },
          { path: 'mypage/deliveryInfo', lazy: lazyRoute(() => import('@/pages/deliveryInfo')) },
          { path: 'mypage/order', lazy: lazyRoute(() => import('@/pages/orderListPage')) },
          { path: 'mypage/order/orderDetailPersonal', lazy: lazyRoute(() => import('@/pages/orderDetailPersonal')) },
          { path: 'mypage/apply', lazy: lazyRoute(() => import('@/pages/ApplyReturnOrExchange')) },
          { path: 'mypage/order/exchange/complete', lazy: lazyRoute(() => import('@/pages/feedback/exchangeOk')) },
          { path: 'mypage/order/return/complete', lazy: lazyRoute(() => import('@/pages/feedback/returnOk')) },
          { path: 'notifications', lazy: lazyRoute(() => import('@/pages/notifications')) },
          { path: 'payment', lazy: lazyRoute(() => import('@/pages/payment')) },
          { path: '/payment/confirm', lazy: lazyRoute(() => import('@/pages/feedback/paymentStatusWrapper')) },
          { path: '/payment/fail', lazy: lazyRoute(() => import('@/pages/feedback/paymentStatusWrapper')) },
          { path: 'address/change', lazy: lazyRoute(() => import('@/pages/addressChange')) },
          { path: 'address/edit', lazy: lazyRoute(() => import('@/pages/editAddress')) },
          { path: 'address/add', lazy: lazyRoute(() => import('@/pages/addAddress')) },
        ],
      },
    ],
  },
]);
