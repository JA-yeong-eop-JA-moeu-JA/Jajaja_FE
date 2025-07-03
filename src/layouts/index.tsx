import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';

import ModalProvider from '@/components/common/modal';

export default function Layout() {
  const { isModalOpen } = useModalStore();
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);
  return (
    <ModalProvider>
      <div className="w-full h-screen">
        <Outlet />
      </div>
    </ModalProvider>
  );
}
