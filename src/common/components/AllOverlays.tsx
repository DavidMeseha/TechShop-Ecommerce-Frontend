"use client";

import React, { useEffect, useMemo } from "react";
import EditProfileOverlay from "@/web/components/overlays/editProfileOverlay/EditProfileOverlay";
import AttributesOverlay from "@/web/components/overlays/AttributesOverlay/AttributesOverlay";
import ProductMoreInfoOverlay from "@/web/components/overlays/ProductMoreInfo";
import AddReviewOverlay from "@/web/components/overlays/AddReviewOverlay";
import AddNewAddress from "@/web/components/overlays/AddNewAddress";
import SearchOverlay from "@/web/components/overlays/SearchOverlay";
import { AnimatePresence } from "framer-motion";
import ProfileMenuOverlay from "@/web/components/overlays/ProfileMenu";
import { useOverlayStore } from "@/common/stores/overlayStore";
import { useProductStore } from "@/common/stores/productStore";
import Login from "@/web/components/overlays/auth/Login";
import Register from "@/web/components/overlays/auth/Register";
import HomeMenu from "@/web/components/overlays/HomeMenu";
import { setLastPageBeforSignUp } from "@/common/lib/last-page-before-signup";
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

    if (pathname.includes("/login") || pathname.includes("/register") || pathname.includes("/admin")) return;
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
