import { create } from "zustand";

type UIState = {
  isFundModalOpen: boolean;
  openFundModal: () => void;
  closeFundModal: () => void;
};

export const useUiStore = create<UIState>((set) => ({
  isFundModalOpen: false,
  openFundModal: () => set({ isFundModalOpen: true }),
  closeFundModal: () => set({ isFundModalOpen: false })
}));
