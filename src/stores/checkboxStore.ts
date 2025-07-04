import { create } from 'zustand';

export type TCheckboxType =
  | 'today-hide'
  | 'default-address'
  | 'select-all'
  | 'agree-all'
  | 'terms-service'
  | 'terms-privacy'
  | 'terms-age'
  | 'terms-financial'
  | 'terms-marketing';

interface ICheckboxStore {
  checkedItems: Record<TCheckboxType, boolean>;
  toggle: (type: TCheckboxType) => void;
  setChecked: (type: TCheckboxType, value: boolean) => void;
  reset: () => void;
}

const initialCheckedItems: Record<TCheckboxType, boolean> = {
  'today-hide': false,
  'default-address': false,
  'select-all': false,
  'agree-all': false,
  'terms-service': false,
  'terms-privacy': false,
  'terms-age': false,
  'terms-financial': false,
  'terms-marketing': false,
};

export const useCheckboxStore = create<ICheckboxStore>((set, get) => ({
  checkedItems: initialCheckedItems,

  toggle: (type) => {
    const current = get().checkedItems[type];
    const newCheckedItems = { ...get().checkedItems, [type]: !current };

    // agree-all 동작 처리
    if (type === 'agree-all') {
      newCheckedItems['terms-service'] = !current;
      newCheckedItems['terms-privacy'] = !current;
      newCheckedItems['terms-age'] = !current;
      newCheckedItems['terms-financial'] = !current;
      newCheckedItems['terms-marketing'] = !current;
    } else if (
      type === 'terms-service' ||
      type === 'terms-privacy' ||
      type === 'terms-age' ||
      type === 'terms-financial' ||
      type === 'terms-marketing'
    ) {
      const allChecked =
        newCheckedItems['terms-service'] &&
        newCheckedItems['terms-privacy'] &&
        newCheckedItems['terms-age'] &&
        newCheckedItems['terms-financial'] &&
        newCheckedItems['terms-marketing'];

      newCheckedItems['agree-all'] = allChecked;
    }

    set({ checkedItems: newCheckedItems });
  },

  setChecked: (type, value) => {
    set((state) => ({
      checkedItems: {
        ...state.checkedItems,
        [type]: value,
      },
    }));
  },

  reset: () => set(() => initialCheckedItems),
}));
