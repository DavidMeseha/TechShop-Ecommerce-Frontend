import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { getCartIds } from "@/actions";
import { User } from "@/types";
import { getFollowIds, getLikeIds, getReviewIds, getSaveIds, getUserActions } from "@/services/getUserActions.service";

export interface UserStore {
  user: User | null;
  reviews: string[];
  cartItems: { product: string; quantity: number }[];
  saves: string[];
  following: string[];
  likes: string[];
  setLikes: (likes?: string[]) => Promise<void>;
  setCartItems: (cartItems?: { product: string; quantity: number }[]) => Promise<void>;
  setSaves: (saves?: string[]) => Promise<void>;
  setFollowedVendors: (followed?: string[]) => Promise<void>;
  setReviews: (reviews?: string[]) => Promise<void>;
  setUser: (user: User | null) => void;
  setUserActions: () => Promise<void>;
}

let likesTimeout: number;
let savesTimeout: number;

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        reviews: [],
        cartItems: [],
        saves: [],
        likes: [],
        following: [],

        setReviews: async (reviews?: string[]) => {
          const result = reviews ?? (await getReviewIds());
          set({ reviews: result });
        },
        setLikes: async (likes?: string[]) => {
          if (likes) return set({ likes: likes });
          window.clearTimeout(likesTimeout);
          likesTimeout = window.setTimeout(async () => {
            const result = await getLikeIds();
            set({ likes: result });
          }, 10_000);
        },
        setCartItems: async (cartItems?: { product: string; quantity: number }[]) => {
          const result = cartItems ?? (await getCartIds());
          set({ cartItems: result });
        },
        setSaves: async (saves?: string[]) => {
          if (saves) return set({ saves: saves });
          window.clearTimeout(savesTimeout);
          savesTimeout = window.setTimeout(async () => {
            const result = await getSaveIds();
            set({ saves: result });
          }, 10_000);
        },
        setFollowedVendors: async (followed?: string[]) => {
          const result = followed ?? (await getFollowIds());
          set({ following: result });
        },
        setUser: (user: User | null) => set({ user: user }),
        setUserActions: async () => {
          const result = await getUserActions();
          set({
            reviews: result.reviews,
            likes: result.likes,
            following: result.follows,
            cartItems: result.cart,
            saves: result.saves
          });
        }
      }),
      {
        name: "user",
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);
