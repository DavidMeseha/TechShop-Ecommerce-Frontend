import { create } from "zustand";
import { User } from "@/types";
import { getCartIds } from "@/services/getUserActions.service";

export interface UserStore {
  user: User | null;
  cartItems: string[];

  setUser: (user: User | null) => void;
  getCartItems: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  cartItems: [],

  getCartItems: async () => {
    const result = await getCartIds();
    set({ cartItems: result });
  },

  setUser: (user: User | null) => set({ user: user })
}));
