import getCountries from "@/services/getCountries.service";
import { IFullProduct, IProductAttribute } from "@/types";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

export interface GeneralStore {
  isEditProfileOpen: boolean;
  isShareOpen: boolean;
  isProfileMenuOpen: boolean;
  isAddToCartOpen: boolean;
  isProductMoreInfoOpen: boolean;
  isHomeMenuOpen: boolean;
  isSearchOpen: boolean;
  isAdvancedSearchOpen: boolean;
  isAddReviewOpen: boolean;
  isAddAddressOpen: boolean;
  overlayProduct: IFullProduct | null;
  overlayProductId: string | null;
  search: string;
  countries: { name: string; _id: string; code: string }[];
  action: { name: string | null; fn: ((attr: IProductAttribute[]) => void) | null };

  //Overlays setState
  setIsProductMoreInfoOpen: (val: boolean, productId?: string) => void;
  setIsEditProfileOpen: (val: boolean) => void;
  setIsProfileMenuOpen: (val: boolean) => void;
  setIsHomeMenuOpen: (val: boolean) => void;
  setIsAdvancedSearchOpen: (val: boolean) => void;
  setIsAddAddressOpen: (val: boolean) => void;
  setIsProductAttributesOpen: (
    val: boolean,
    productId?: string,
    actionName?: string,
    action?: (atrr: IProductAttribute[]) => void
  ) => void;
  setIsSearchOpen: (val: boolean) => void;

  //data setState
  setSearch: (val: string) => void;
  setIsAddReviewOpen: (val: boolean, productId?: string) => void;
  setCountries: () => void;
}

export const useAppStore = create<GeneralStore>()(
  devtools(
    persist(
      (set) => ({
        //overlay states
        isEditProfileOpen: false,
        isShareOpen: false,
        isAddToCartOpen: false,
        isProfileMenuOpen: false,
        isProductMoreInfoOpen: false,
        isHomeMenuOpen: false,
        isSearchOpen: false,
        isAdvancedSearchOpen: false,
        isAddReviewOpen: false,
        isAddAddressOpen: false,

        //overlay data
        search: "",
        overlayProduct: null,
        overlayProductId: null,
        action: { name: null, fn: null },
        countries: [],

        //overlay toggles & data set
        setIsHomeMenuOpen: (val: boolean) => set({ isHomeMenuOpen: val }),
        setIsAddAddressOpen: (val: boolean) => set({ isAddAddressOpen: val }),
        setIsEditProfileOpen: (val: boolean) => set({ isEditProfileOpen: val }),
        setIsProfileMenuOpen: (val: boolean) => set({ isProfileMenuOpen: val }),
        setIsAdvancedSearchOpen: (val: boolean) => set({ isAdvancedSearchOpen: val }),
        setIsSearchOpen: (val: boolean) => set({ isSearchOpen: val }),
        setSearch: (val: string) => set({ search: val }),
        setIsProductMoreInfoOpen: (val: boolean, productId?: string) =>
          set((prev) => ({ isProductMoreInfoOpen: val, overlayProductId: productId ?? prev.overlayProductId })),
        setIsAddReviewOpen: (val: boolean, productId?: string) =>
          set((prev) => ({ isAddReviewOpen: val, overlayProductId: productId ?? prev.overlayProductId })),
        setCountries: async () => set({ countries: await getCountries() }),
        setIsProductAttributesOpen: (
          val: boolean,
          productId?: string,
          actionName?: string,
          action?: (attr: IProductAttribute[]) => void
        ) => {
          set((prev) => ({
            isAddToCartOpen: val,
            overlayProductId: productId ?? prev.overlayProductId
          }));

          setTimeout(() => {
            set({ action: { name: actionName ?? null, fn: action ?? null } });
          }, 150);
        }
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);
