import { create } from "zustand";

export type OverlayStore = {
  isEditProfileOpen: boolean;
  isShareOpen: boolean;
  isProfileMenuOpen: boolean;
  isHomeMenuOpen: boolean;
  isSearchOpen: boolean;
  isAdvancedSearchOpen: boolean;
  isAddAddressOpen: boolean;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;

  switchSignupOverlay: (isLoginOpen: boolean) => void;
  setIsRegisterOpen: (isOpen: boolean) => void;
  setIsLoginOpen: (isOpen: boolean) => void;
  setIsEditProfileOpen: (isOpen: boolean) => void;
  setIsProfileMenuOpen: (isOpen: boolean) => void;
  setIsHomeMenuOpen: (isOpen: boolean) => void;
  setIsAdvancedSearchOpen: (isOpen: boolean) => void;
  setIsAddAddressOpen: (isOpen: boolean) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
};

export const useOverlayStore = create<OverlayStore>((set) => ({
  isEditProfileOpen: false,
  isShareOpen: false,
  isProfileMenuOpen: false,
  isHomeMenuOpen: false,
  isSearchOpen: false,
  isAdvancedSearchOpen: false,
  isAddAddressOpen: false,
  isLoginOpen: false,
  isRegisterOpen: false,

  switchSignupOverlay: (isLoginOpen: boolean) => {
    if (isLoginOpen) set({ isRegisterOpen: !isLoginOpen });
    else set({ isLoginOpen: isLoginOpen });

    setTimeout(() => {
      if (isLoginOpen) set({ isLoginOpen: isLoginOpen });
      else set({ isRegisterOpen: !isLoginOpen });
    }, 500);
  },
  setIsRegisterOpen: (isOpen: boolean) => set({ isRegisterOpen: isOpen }),
  setIsLoginOpen: (isOpen: boolean) => set({ isLoginOpen: isOpen }),
  setIsHomeMenuOpen: (isOpen: boolean) => set({ isHomeMenuOpen: isOpen }),
  setIsAddAddressOpen: (isOpen: boolean) => set({ isAddAddressOpen: isOpen }),
  setIsEditProfileOpen: (isOpen: boolean) => set({ isEditProfileOpen: isOpen }),
  setIsProfileMenuOpen: (isOpen: boolean) => set({ isProfileMenuOpen: isOpen }),
  setIsAdvancedSearchOpen: (isOpen: boolean) => set({ isAdvancedSearchOpen: isOpen }),
  setIsSearchOpen: (isOpen: boolean) => set({ isSearchOpen: isOpen })
}));
