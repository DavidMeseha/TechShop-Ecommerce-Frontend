import { create } from "zustand";
import { ICustomeProductAttribute } from "@/types";

type Store = {
  isProductAttributesOpen: boolean;
  isAddReviewOpen: boolean;
  isProductMoreInfoOpen: boolean;

  action: ((attr: ICustomeProductAttribute[], quantity: number) => void) | undefined;
  productIdToOverlay: string | undefined;

  setIsProductMoreInfoOpen: (isOpen: boolean, productId?: string) => void;
  setIsAddReviewOpen: (isOpen: boolean, productId?: string) => void;
  setIsProductAttributesOpen: (
    isOpen: boolean,
    productId?: string,
    action?: (attr: ICustomeProductAttribute[], quantity: number) => void
  ) => void;
};

export const useProductStore = create<Store>((set) => ({
  overlayProduct: null,
  overlayProductId: null,
  isProductAttributesOpen: false,
  isAddReviewOpen: false,
  isProductMoreInfoOpen: false,

  action: undefined,
  productIdToOverlay: undefined,

  setIsProductMoreInfoOpen: (isOpen: boolean, productId?: string) => {
    set({ isProductMoreInfoOpen: isOpen });

    if (isOpen) set({ productIdToOverlay: productId });
    else {
      setTimeout(() => {
        set({ productIdToOverlay: productId });
      }, 150);
    }
  },
  setIsAddReviewOpen: (isOpen: boolean, productId?: string) => {
    set(() => ({
      isAddReviewOpen: isOpen
    }));

    if (isOpen) set({ productIdToOverlay: productId });
    else {
      setTimeout(() => {
        set({ productIdToOverlay: productId });
      }, 150);
    }
  },
  setIsProductAttributesOpen: (
    isOpen: boolean,
    productId?: string,
    action?: (attr: ICustomeProductAttribute[], quantity: number) => void
  ) => {
    set({ isProductAttributesOpen: isOpen });
    if (isOpen) set({ productIdToOverlay: productId, action: action });
    else {
      setTimeout(() => {
        set({ action: undefined, productIdToOverlay: productId });
      }, 150);
    }
  }
}));
