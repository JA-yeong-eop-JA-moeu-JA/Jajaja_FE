import { create } from 'zustand';

export type TCheckboxType = 'agree-all' | 'terms-service' | 'terms-privacy' | 'terms-age' | 'terms-financial' | 'terms-marketing';

interface IAgreementCheckboxStore {
  checkedItems: Record<TCheckboxType, boolean>;
  toggle: (type: TCheckboxType) => void;
  reset: () => void;
}

const initialCheckedItems: Record<TCheckboxType, boolean> = {
  'agree-all': false,
  'terms-service': false,
  'terms-privacy': false,
  'terms-age': false,
  'terms-financial': false,
  'terms-marketing': false,
};

export const useAgreementCheckboxStore = create<IAgreementCheckboxStore>((set, get) => ({
  checkedItems: initialCheckedItems,

  toggle: (type) => {
    const current = get().checkedItems[type];
    const newCheckedItems = { ...get().checkedItems, [type]: !current };

    if (type === 'agree-all') {
      Object.keys(newCheckedItems).forEach((key) => {
        if (key !== 'agree-all') {
          newCheckedItems[key as TCheckboxType] = !current;
        }
      });
    } else {
      const allChecked = ['terms-service', 'terms-privacy', 'terms-age', 'terms-financial', 'terms-marketing'].every((k) =>
        k === type ? !current : newCheckedItems[k as TCheckboxType],
      );
      newCheckedItems['agree-all'] = allChecked;
    }

    set({ checkedItems: newCheckedItems });
  },

  reset: () => set({ checkedItems: initialCheckedItems }),
}));
