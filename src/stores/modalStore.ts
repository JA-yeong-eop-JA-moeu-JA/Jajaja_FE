import type { ComponentType } from 'react';
import { createElement } from 'react';
import { create } from 'zustand';

import type { TGetNoti } from '@/types/notifications/TGetNotiList';

import DeliveryRequestModal from '@/components/modal/deliveryModal';
import HomeModal from '@/components/modal/homeModal';
import ImageModal from '@/components/modal/imageModal';
import LoginModal from '@/components/modal/LoginModal';
import OptionModal from '@/components/modal/optionModal';
import ReviewModal from '@/components/modal/reviewModal';
import CartModal from '@/components/modal/shoppingCartModal';
import TeamModal from '@/components/modal/TeamModal';

import type { ICartItem } from '@/pages/shoppingCart';

export type TModalType = 'alert' | 'confirm' | 'bottom-sheet' | 'bottom-drawer' | 'bottom-drawer-team' | 'image' | 'cart-option' | 'delivery' | 'login';

type TComponentType = ComponentType<any>;

const MODAL_COMPONENTS: Record<TModalType, TComponentType> = {
  'confirm': TeamModal,
  'alert': ReviewModal,
  'bottom-sheet': HomeModal,
  'bottom-drawer': (props: any) => OptionModal({ type: 'personal', ...props }),
  'bottom-drawer-team': (props: any) => OptionModal({ type: 'team', ...props }),
  'image': ImageModal,
  'cart-option': CartModal,
  'delivery': DeliveryRequestModal,
  'login': LoginModal,
};

interface IModalOptions {
  onDelete?: () => void;
  message?: string;
  item?: ICartItem;
  onUpdate?: (item: ICartItem) => void;
  onSelect?: (text: string) => void;
  teamId?: number;
  mode?: string;
  matching?: TGetNoti;
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

    const WrappedComponent =
      type === 'cart-option'
        ? (props: any) =>
            createElement(ModalComponent, {
              item: options.item,
              onUpdate: options.onUpdate,
              ...(props || {}),
            })
        : (props: any) => createElement(ModalComponent, { ...options, ...(props || {}) });

    set({
      isModalOpen: true,
      type,
      modalContent: WrappedComponent,
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

export const openLoginModal = (options?: IModalOptions) => {
  const s = useModalStore.getState();
  if (s.isModalOpen && s.type === 'login') return;
  s.openModal('login', options);
};
