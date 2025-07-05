import { create } from 'zustand';

interface IProductCheckboxStore {
  checkedItems: Record<string, boolean>;
  initialize: (ids: string[], initial?: boolean) => void;
  toggle: (id: string) => void;
  toggleAll: (value: boolean) => void;
  isAllChecked: () => boolean;
  reset: () => void;
}

export const useProductCheckboxStore = create<IProductCheckboxStore>((set, get) => ({
  checkedItems: {},

  initialize: (ids, initial = false) => {
    const newItems = ids.reduce(
      (acc, id) => {
        acc[id] = initial;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    set({ checkedItems: newItems });
  },

  toggle: (id) => {
    const current = get().checkedItems[id];
    set((state) => ({
      checkedItems: { ...state.checkedItems, [id]: !current },
    }));
  },

  toggleAll: (value) => {
    const allKeys = Object.keys(get().checkedItems);
    const newItems = allKeys.reduce(
      (acc, id) => {
        acc[id] = value;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    set({ checkedItems: newItems });
  },

  isAllChecked: () => {
    const items = get().checkedItems;
    return Object.values(items).length > 0 && Object.values(items).every((v) => v);
  },

  reset: () => set({ checkedItems: {} }),
}));
