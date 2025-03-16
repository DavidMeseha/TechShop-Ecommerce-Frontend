import { create } from "zustand";
import { User } from "@/types";
import { getCartIds } from "@/services/getUserActions.service";

export interface UserStore {
  user: User | null;
  cartItems: string[];
  lastPageBeforSignUp: string;

  setUser: (user: User | null) => void;
  setLastPageBeforSignUp: (page: string) => void;
  getCartItems: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  cartItems: [],
  lastPageBeforSignUp: "/", //used to redirect user to the last page before sign up

  setLastPageBeforSignUp: (page: string) => set({ lastPageBeforSignUp: page }),

  getCartItems: async () => {
    const result = await getCartIds();
    set({ cartItems: result });
  },

  setUser: (user: User | null) => set({ user: user })
}));
