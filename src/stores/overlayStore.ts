import { create } from "zustand";

export type OverlayStore = {
  isEditProfileOpen: boolean;
  isShareOpen: boolean;
  isProfileMenuOpen: boolean;
  isHomeMenuOpen: boolean;
  isSearchOpen: boolean;
  isAdvancedSearchOpen: boolean;
  isAddAddressOpen: boolean;

  setIsEditProfileOpen: (val: boolean) => void;
  setIsProfileMenuOpen: (val: boolean) => void;
  setIsHomeMenuOpen: (val: boolean) => void;
  setIsAdvancedSearchOpen: (val: boolean) => void;
  setIsAddAddressOpen: (val: boolean) => void;
  setIsSearchOpen: (val: boolean) => void;
};

export const useOverlayStore = create<OverlayStore>((set) => ({
  isEditProfileOpen: false,
  isShareOpen: false,
  isProfileMenuOpen: false,
  isHomeMenuOpen: false,
  isSearchOpen: false,
  isAdvancedSearchOpen: false,
  isAddAddressOpen: false,

  setIsHomeMenuOpen: (val: boolean) => set({ isHomeMenuOpen: val }),
  setIsAddAddressOpen: (val: boolean) => set({ isAddAddressOpen: val }),
  setIsEditProfileOpen: (val: boolean) => set({ isEditProfileOpen: val }),
  setIsProfileMenuOpen: (val: boolean) => set({ isProfileMenuOpen: val }),
  setIsAdvancedSearchOpen: (val: boolean) => set({ isAdvancedSearchOpen: val }),
  setIsSearchOpen: (val: boolean) => set({ isSearchOpen: val })
}));
