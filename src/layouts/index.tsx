import { type PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useModalStore } from '@/stores/modalStore';

import ModalProvider from '@/components/common/modal';
import Subscriber from '@/components/Subscriber';

import BottomBar from '../components/head_bottom/BottomBar';

import { useAuth } from '@/context/AuthContext';

export default function Layout({ children }: PropsWithChildren) {
  const { isModalOpen } = useModalStore();
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  const hideBottomBarPaths = ['/payment', '/address/add', '/product', '/mypage/deliveryInfo', '/mypage/order', '/mypage/apply'];

  const shouldHideBottomBar = hideBottomBarPaths.some((path) => pathname.startsWith(path));

  const showBottomBar = !isModalOpen && pathname !== '/' && !shouldHideBottomBar;

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
  }, [isModalOpen]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto">
          {children}
          <Toaster />
          {isLoggedIn && <Subscriber />}
        </main>
        {showBottomBar && <BottomBar />}
      </div>
    </ModalProvider>
  );
}
