"use client";

import React, { useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import EditProfileOverlay from "./EditProfileOverlay";
import { usePathname } from "next/navigation";
import AttributesOverlay from "./AttributesOverlay";
import ProductMoreInfoOverlay from "./ProductMoreInfo";
import AddReviewOverlay from "./AddReviewOverlay";
import AddNewAddress from "./AddNewAddress";
import SearchOverlay from "./SearchOverlay";
import { AnimatePresence } from "framer-motion";
import ProfileMenuOverlay from "./ProfileMenu";

export default function AllOverlays() {
  const {
    isEditProfileOpen,
    isShareOpen,
    isProfileMenuOpen,
    isAddToCartOpen,
    isProductMoreInfoOpen,
    isSearchOpen,
    isAdvancedSearchOpen,
    isAddReviewOpen,
    isAddAddressOpen,
    setIsProductAttributesOpen,
    setIsEditProfileOpen,
    setIsSearchOpen,
    setIsProfileMenuOpen,
    setIsProductMoreInfoOpen,
    setIsHomeMenuOpen,
    setIsAdvancedSearchOpen,
    setIsAddAddressOpen
  } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    setIsEditProfileOpen(false);
    setIsProfileMenuOpen(false);
    setIsProductAttributesOpen(false);
    setIsProductMoreInfoOpen(false);
    setIsHomeMenuOpen(false);
    setIsSearchOpen(false);
    setIsAdvancedSearchOpen(false);
    setIsAddAddressOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (
      isEditProfileOpen ||
      isShareOpen ||
      isAddToCartOpen ||
      isProfileMenuOpen ||
      isProductMoreInfoOpen ||
      isAdvancedSearchOpen ||
      isAddReviewOpen ||
      isAddAddressOpen ||
      isSearchOpen
    )
      document.body.style.overflowY = "hidden";
    else document.body.style.overflowY = "auto";
  }, [
    isEditProfileOpen,
    isShareOpen,
    isAddToCartOpen,
    isProfileMenuOpen,
    isProductMoreInfoOpen,
    isAdvancedSearchOpen,
    isAddReviewOpen,
    isAddAddressOpen,
    isSearchOpen
  ]);

  return (
    <AnimatePresence>
      {isEditProfileOpen ? <EditProfileOverlay /> : null}
      {isProfileMenuOpen ? <ProfileMenuOverlay /> : null}
      {isAddToCartOpen ? <AttributesOverlay /> : null}
      {isProductMoreInfoOpen ? <ProductMoreInfoOverlay /> : null}
      {isSearchOpen ? <SearchOverlay /> : null}
      {isAddReviewOpen ? <AddReviewOverlay /> : null}
      {isAddAddressOpen ? <AddNewAddress /> : null}
    </AnimatePresence>
  );
}
