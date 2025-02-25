"use client";

import React, { useEffect } from "react";
import EditProfileOverlay from "./EditProfileOverlay";
import { usePathname } from "next/navigation";
import AttributesOverlay from "./AttributesOverlay";
import ProductMoreInfoOverlay from "./ProductMoreInfo";
import AddReviewOverlay from "./AddReviewOverlay";
import AddNewAddress from "./AddNewAddress";
import SearchOverlay from "./SearchOverlay";
import { AnimatePresence } from "framer-motion";
import ProfileMenuOverlay from "./ProfileMenu";
import { useOverlayStore } from "@/stores/overlayStore";
import { useProductStore } from "@/stores/productStore";

export default function AllOverlays() {
  const {
    isEditProfileOpen,
    isShareOpen,
    isProfileMenuOpen,
    isSearchOpen,
    isAdvancedSearchOpen,
    isAddAddressOpen,
    setIsEditProfileOpen,
    setIsSearchOpen,
    setIsProfileMenuOpen,
    setIsHomeMenuOpen,
    setIsAdvancedSearchOpen,
    setIsAddAddressOpen
  } = useOverlayStore();
  const {
    isProductAttributesOpen,
    isAddReviewOpen,
    isProductMoreInfoOpen,
    setIsProductAttributesOpen,
    setIsAddReviewOpen,
    setIsProductMoreInfoOpen
  } = useProductStore();
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
    setIsAddReviewOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (
      isEditProfileOpen ||
      isShareOpen ||
      isProductAttributesOpen ||
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
    isProductAttributesOpen,
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
      {isProductAttributesOpen ? <AttributesOverlay /> : null}
      {isProductMoreInfoOpen ? <ProductMoreInfoOverlay /> : null}
      {isSearchOpen ? <SearchOverlay /> : null}
      {isAddReviewOpen ? <AddReviewOverlay /> : null}
      {isAddAddressOpen ? <AddNewAddress /> : null}
    </AnimatePresence>
  );
}
