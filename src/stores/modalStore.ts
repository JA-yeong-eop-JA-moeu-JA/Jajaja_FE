import type { JSX } from 'react';
import { create } from 'zustand';

import ExampleModal from '@/components/modal/exampleModal';
import HomeModal from '@/components/modal/homeModal';
import OptionModal from '@/components/modal/optionModal';
import ReviewModal from '@/components/modal/reviewModal';

export type TModalType = 'alert' | 'confirm' | 'bottom-sheet' | 'bottom-drawer' | 'bottom-drawer-team';
type TComponentType = (props?: Record<string, string>) => JSX.Element;
const MODAL_COMPONENTS: Record<TModalType, TComponentType> = {
  'confirm': ExampleModal,
  'alert': ReviewModal,
  'bottom-sheet': HomeModal,
  'bottom-drawer': () => OptionModal({ type: 'personal' }),
  'bottom-drawer-team': () => OptionModal({ type: 'team' }),
};

interface IModalOptions {
  onDelete?: () => void;
  message?: string;
  [key: string]: any;
}

interface IModalStore {
  isModalOpen: boolean;
  modalContent: TComponentType | null;
  type: TModalType | null;
  options?: IModalOptions;
  openModal: (type: TModalType, options?: IModalOptions) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalStore>((set) => ({
  isModalOpen: false,
  modalContent: null,
  type: null,
  options: {},
  openModal: (type, options = {}) => {
    const ModalComponent = MODAL_COMPONENTS[type];
    set({
      isModalOpen: true,
      type,
      modalContent: ModalComponent,
      options,
    });
  },
  closeModal: () =>
    set({
      isModalOpen: false,
      type: null,
      modalContent: null,
      options: {},
    }),
}));
