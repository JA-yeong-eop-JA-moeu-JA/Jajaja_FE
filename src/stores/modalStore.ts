import type { JSX } from 'react';
import { create } from 'zustand';

import ExampleModal from '@/components/modal/exampleModal';
import HomeModal from '@/components/modal/homeModal';
import ReviewModal from '@/components/modal/reviewModal';

export type TModalType = 'alert' | 'confirm' | 'bottom-sheet' | 'bottom-drawer';
type TComponentType = () => JSX.Element;
const MODAL_COMPONENTS: Record<TModalType, TComponentType> = {
  'confirm': ExampleModal,
  'alert': ReviewModal,
  'bottom-sheet': HomeModal,
  'bottom-drawer': ExampleModal,
};

interface IModalStore {
  isModalOpen: boolean;
  modalContent: TComponentType | null;
  type: TModalType | null;
  openModal: (type: TModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalStore>((set) => ({
  isModalOpen: false,
  modalContent: null,
  type: null,
  openModal: (type) => {
    const ModalComponent = MODAL_COMPONENTS[type];
    set({
      isModalOpen: true,
      type,
      modalContent: ModalComponent,
    });
  },
  closeModal: () =>
    set({
      isModalOpen: false,
      type: null,
      modalContent: null,
    }),
}));
