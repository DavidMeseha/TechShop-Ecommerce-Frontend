import { create } from "zustand";
import { User } from "@/types";
import {
  getCartIds,
  getFollowIds,
  getLikeIds,
  getReviewIds,
  getSaveIds,
  getUserActions
} from "@/services/getUserActions.service";

export interface UserStore {
  user: User | null;
  reviews: string[];
  cartItems: { product: string; quantity: number }[];
  saves: string[];
  followedVendors: string[];
  likes: string[];
  lastPageBeforSignUp: string;

  setLastPageBeforSignUp: (page: string) => void;
  getFollowedVendors: () => Promise<void>;
  addToFollowedVendors: (vendorId: string) => void;
  removeFromFollowedVendors: (vendorId: string) => void;

  getReviews: () => Promise<void>;

  setUser: (user: User | null) => void;
  setUserActions: () => Promise<void>;

  getLikes: () => Promise<void>;
  removeFromLikes: (id: string) => void;
  addToLikes: (id: string) => void;

  getSaves: () => Promise<void>;
  removeFromSaves: (id: string) => void;
  addToSaves: (id: string) => void;

  getCartItems: () => Promise<void>;
  addToCart: (id: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
}

let likesTimeout: number;
let savesTimeout: number;
let followingTimeout: number;

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  reviews: [],
  cartItems: [],
  saves: [],
  likes: [],
  followedVendors: [],
  lastPageBeforSignUp: "/", //used to redirect user to the last page before sign up

  setLastPageBeforSignUp: (page: string) => set({ lastPageBeforSignUp: page }),

  getReviews: async () => {
    const result = await getReviewIds();
    set({ reviews: result });
  },

  //--------------------
  //Likes state handling
  getLikes: async () => {
    window.clearTimeout(likesTimeout);
    likesTimeout = window.setTimeout(async () => {
      const result = await getLikeIds();
      set({ likes: result });
    }, 15_000);
  },
  removeFromLikes: function (id: string) {
    set(({ likes }) => {
      const temp = [...likes];
      temp.splice(temp.indexOf(id), 1);
      return { likes: [...temp] };
    });
  },
  addToLikes: function (id: string) {
    set(({ likes }) => {
      return { likes: [...likes, id] };
    });
  },

  //--------------------
  //Cart State handling
  getCartItems: async () => {
    const result = await getCartIds();
    set({ cartItems: result });
  },
  addToCart: function (id: string, quantity: number = 1) {
    const product = { product: id, quantity: quantity };
    set(({ cartItems }) => {
      const temp = [...cartItems];
      temp.push(product);
      return { cartItems: temp };
    });
  },
  removeFromCart: function (id: string) {
    set(({ cartItems }) => {
      const temp = [...cartItems];
      temp.splice(
        temp.findIndex((item) => item.product === id),
        1
      );
      return { cartItems: temp };
    });
  },

  //--------------------
  //Saved state handling
  getSaves: async () => {
    window.clearTimeout(savesTimeout);
    savesTimeout = window.setTimeout(async () => {
      const result = await getSaveIds();
      set({ saves: result });
    }, 15_000);
  },
  removeFromSaves: (id: string) => {
    set(({ saves }) => {
      const temp = [...saves];
      temp.splice(temp.indexOf(id), 1);
      return { saves: [...temp] };
    });
  },
  addToSaves: (id: string) => {
    set(({ saves }) => ({ saves: [...saves, id] }));
  },

  //--------------------
  //followed vendors state handling
  getFollowedVendors: async () => {
    window.clearTimeout(followingTimeout);
    followingTimeout = window.setTimeout(async () => {
      const result = await getFollowIds();
      set({ followedVendors: result });
    }, 15_000);
  },
  removeFromFollowedVendors: (vendorId: string) => {
    set(({ followedVendors }) => {
      const temp = [...followedVendors];
      temp.splice(temp.indexOf(vendorId), 1);
      return { followedVendors: [...temp] };
    });
  },
  addToFollowedVendors: (vendorId: string) => {
    set(({ followedVendors }) => ({ followedVendors: [...followedVendors, vendorId] }));
  },

  //--------------------
  //user setting functions
  setUser: (user: User | null) => set({ user: user }),
  setUserActions: async () => {
    const result = await getUserActions();
    set({
      reviews: result.reviews,
      likes: result.likes,
      followedVendors: result.follows,
      cartItems: result.cart,
      saves: result.saves
    });
  }
}));
