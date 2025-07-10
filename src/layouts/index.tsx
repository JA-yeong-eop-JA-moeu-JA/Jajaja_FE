import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useModalStore } from '@/stores/modalStore';

import ModalProvider from '@/components/common/modal';

import BottomBar from '../components/head_bottom/BottomBar';

export default function Layout() {
  const { isModalOpen } = useModalStore();

  const path = useLocation().pathname;
  const showBottomBar = !isModalOpen && ['/', '/payment'].includes(path);
  const { pathname } = useLocation();
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
          <Outlet />
          <Toaster />
        </main>
        {showBottomBar && path !== '/' && <BottomBar />}
      </div>
    </ModalProvider>
  );
}
