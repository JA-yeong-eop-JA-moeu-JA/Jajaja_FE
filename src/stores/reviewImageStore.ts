import { create } from 'zustand';

type TReviewImageState = {
  files: File[];
  setFiles: (files: File[]) => void;
  reset: () => void;
};

export const useReviewImageStore = create<TReviewImageState>((set, get) => ({
  files: [],
  setFiles: (files) => {
    const prev = get().files;
    if (prev.length === files.length && prev.every((f, i) => f === files[i])) return;
    set({ files });
  },
  reset: () => set({ files: [] }),
}));
