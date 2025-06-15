import { create } from "zustand";
import { IUser } from "@/types";
import { getCartIds } from "@/services/userActions.service";

export interface UserStore {
  user: IUser | null;
  cartItems: string[];

  setUser: (user: IUser | null) => void;
  getCartItems: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  cartItems: [],

  getCartItems: async () => {
    const result = await getCartIds();
    set({ cartItems: result });
  },

  setUser: (user: IUser | null) => set({ user: user })
}));
