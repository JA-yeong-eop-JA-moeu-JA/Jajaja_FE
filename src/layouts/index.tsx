import { type PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useModalStore } from '@/stores/modalStore';

import ModalProvider from '@/components/common/modal';

import BottomBar from '../components/head_bottom/BottomBar';

export default function Layout({ children }: PropsWithChildren) {
  const { isModalOpen } = useModalStore();
  const { pathname } = useLocation();

  // BottomBar를 숨길 페이지 정의
  const hideBottomBarPaths = ['/payment', '/address/add'];

  const shouldHideBottomBar = hideBottomBarPaths.some((path) => pathname.startsWith(path));

  const showBottomBar = !isModalOpen && pathname !== '/' && !shouldHideBottomBar;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
        </main>
        {showBottomBar && <BottomBar />}
      </div>
    </ModalProvider>
  );
}
