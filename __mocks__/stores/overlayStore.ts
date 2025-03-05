import { OverlayStore } from "@/stores/overlayStore";
import { jest } from "@jest/globals";

export const mockOverlayStore: OverlayStore = {
  isEditProfileOpen: false,
  isShareOpen: false,
  isProfileMenuOpen: false,
  isHomeMenuOpen: false,
  isSearchOpen: false,
  isAdvancedSearchOpen: false,
  isAddAddressOpen: false,
  isLoginOpen: false,
  isRegisterOpen: false,

  switchSignupOverlay: jest.fn((isLoginOpen: boolean) => {
    mockOverlayStore.isLoginOpen = isLoginOpen;
    mockOverlayStore.isRegisterOpen = !isLoginOpen;
  }),
  setIsRegisterOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isRegisterOpen = isOpen;
  }),
  setIsLoginOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isLoginOpen = isOpen;
  }),
  setIsHomeMenuOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isHomeMenuOpen = isOpen;
  }),
  setIsAddAddressOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isAddAddressOpen = isOpen;
  }),
  setIsEditProfileOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isEditProfileOpen = isOpen;
  }),
  setIsProfileMenuOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isProfileMenuOpen = isOpen;
  }),
  setIsAdvancedSearchOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isAdvancedSearchOpen = isOpen;
  }),
  setIsSearchOpen: jest.fn((isOpen: boolean) => {
    mockOverlayStore.isSearchOpen = isOpen;
  })
};
