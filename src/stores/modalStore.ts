import type { ComponentType } from 'react';
import { createElement } from 'react';
import { create } from 'zustand';

import DeliveryRequestModal from '@/components/modal/deliveryModal';
import ExampleModal from '@/components/modal/exampleModal';
import HomeModal from '@/components/modal/homeModal';
import ImageModal from '@/components/modal/imageModal';
import OptionModal from '@/components/modal/optionModal';
import ReviewModal from '@/components/modal/reviewModal';
import CartModal from '@/components/modal/shoppingCartModal';

import type { ICartItem } from '@/pages/shoppingCart';

export type TModalType = 'alert' | 'confirm' | 'bottom-sheet' | 'bottom-drawer' | 'bottom-drawer-team' | 'image' | 'cart-option' | 'delivery';

type TComponentType = ComponentType<any>;

const MODAL_COMPONENTS: Record<TModalType, TComponentType> = {
  'confirm': ExampleModal,
  'alert': ReviewModal,
  'bottom-sheet': HomeModal,
  'bottom-drawer': () => OptionModal({ type: 'personal' }),
  'bottom-drawer-team': () => OptionModal({ type: 'team' }),
  'image': ImageModal,
  'cart-option': CartModal,
  'delivery': DeliveryRequestModal,
};

interface IModalOptions {
  onDelete?: () => void;
  message?: string;
  item?: ICartItem;
  onUpdate?: (item: ICartItem) => void;
  onSelect?: (text: string) => void;
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
        ? () =>
            createElement(ModalComponent, {
              item: options.item,
              onUpdate: options.onUpdate,
            })
        : ModalComponent;

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
