import { useEffect } from 'react';
import { Outlet,useLocation } from 'react-router-dom';
import BottomBar from '../components/BottomBar';

import { useModalStore } from '@/stores/modalStore';

import ModalProvider from '@/components/common/modal';

export default function Layout() {
  const { isModalOpen } = useModalStore();
  
  const path = useLocation().pathname;
  const showBottomBar = !isModalOpen && ['/', '/payment'].includes(path); 

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);
  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto px-1">
        <Outlet />
      </main>
      {showBottomBar && <BottomBar />}
    </div>
    </ModalProvider>
  );
}
