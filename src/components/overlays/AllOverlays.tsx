"use client";

import React, { useEffect, useMemo } from "react";
import EditProfileOverlay from "./editProfileOverlay/EditProfileOverlay";
import AttributesOverlay from "./AttributesOverlay";
import ProductMoreInfoOverlay from "./ProductMoreInfo";
import AddReviewOverlay from "./AddReviewOverlay";
import AddNewAddress from "./AddNewAddress";
import SearchOverlay from "./SearchOverlay";
import { AnimatePresence } from "framer-motion";
import ProfileMenuOverlay from "./ProfileMenu";
import { useOverlayStore } from "@/stores/overlayStore";
import { useProductStore } from "@/stores/productStore";
import Login from "./auth/Login";
import Register from "./auth/Register";
import HomeMenu from "./HomeMenu";
import { setLastPageBeforSignUp } from "@/lib/localestorageAPI";
import { usePathname } from "next/navigation";

export default function AllOverlays() {
  const pathname = usePathname();

  const {
    isEditProfileOpen,
    isShareOpen,
    isProfileMenuOpen,
    isSearchOpen,
    isAdvancedSearchOpen,
    isAddAddressOpen,
    isRegisterOpen,
    isLoginOpen,
    setIsEditProfileOpen,
    setIsSearchOpen,
    setIsProfileMenuOpen,
    setIsHomeMenuOpen,
    setIsAdvancedSearchOpen,
    setIsAddAddressOpen,
    setIsLoginOpen,
    setIsRegisterOpen
  } = useOverlayStore();

  const {
    isProductAttributesOpen,
    isAddReviewOpen,
    isProductMoreInfoOpen,
    setIsProductAttributesOpen,
    setIsAddReviewOpen,
    setIsProductMoreInfoOpen
  } = useProductStore();

  // Reset all overlays when pathname changes
  useEffect(() => {
    const resetOverlays = () => {
      setIsEditProfileOpen(false);
      setIsProfileMenuOpen(false);
      setIsProductAttributesOpen(false);
      setIsProductMoreInfoOpen(false);
      setIsHomeMenuOpen(false);
      setIsSearchOpen(false);
      setIsAdvancedSearchOpen(false);
      setIsAddAddressOpen(false);
      setIsAddReviewOpen(false);
      setIsRegisterOpen(false);
      setIsLoginOpen(false);
    };
    resetOverlays();

    if (pathname.includes("/login") || pathname.includes("/register")) return;
    setLastPageBeforSignUp(pathname);
  }, [pathname]);

  // Memoize the overlay active state
  const isAnyOverlayOpen = useMemo(
    () =>
      isEditProfileOpen ||
      isShareOpen ||
      isProductAttributesOpen ||
      isProfileMenuOpen ||
      isProductMoreInfoOpen ||
      isAdvancedSearchOpen ||
      isAddReviewOpen ||
      isAddAddressOpen ||
      isSearchOpen ||
      isRegisterOpen ||
      isLoginOpen,
    [
      isLoginOpen,
      isRegisterOpen,
      isEditProfileOpen,
      isShareOpen,
      isProductAttributesOpen,
      isProfileMenuOpen,
      isProductMoreInfoOpen,
      isAdvancedSearchOpen,
      isAddReviewOpen,
      isAddAddressOpen,
      isSearchOpen
    ]
  );

  // Add or remove overflow-y hidden from body when any overlay is open
  useEffect(() => {
    document.body.style.overflowY = isAnyOverlayOpen ? "hidden" : "auto";
  }, [isAnyOverlayOpen]);

  return (
    <>
      <AnimatePresence>
        {isEditProfileOpen && <EditProfileOverlay />}
        {isProfileMenuOpen && <ProfileMenuOverlay />}
        {isProductAttributesOpen && <AttributesOverlay />}
        {isProductMoreInfoOpen && <ProductMoreInfoOverlay />}
        {isSearchOpen && <SearchOverlay />}
        {isAddReviewOpen && <AddReviewOverlay />}
        {isAddAddressOpen && <AddNewAddress />}
        {isLoginOpen && <Login />}
        {isRegisterOpen && <Register />}
      </AnimatePresence>
      <HomeMenu />
    </>
  );
}
