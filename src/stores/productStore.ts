import { create } from "zustand";

type Store = {
  isProductAttributesOpen: boolean;
  isAddReviewOpen: boolean;
  isProductMoreInfoOpen: boolean;

  productIdToOverlay: string | undefined;

  setIsProductMoreInfoOpen: (isOpen: boolean, productId?: string) => void;
  setIsAddReviewOpen: (isOpen: boolean, productId?: string) => void;
  setIsProductAttributesOpen: (isOpen: boolean, productId?: string) => void;
};

export const useProductStore = create<Store>((set) => ({
  overlayProduct: null,
  overlayProductId: null,
  isProductAttributesOpen: false,
  isAddReviewOpen: false,
  isProductMoreInfoOpen: false,

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
  setIsProductAttributesOpen: (isOpen: boolean, productId?: string) => {
    set({ isProductAttributesOpen: isOpen });
    if (isOpen) set({ productIdToOverlay: productId });
    else {
      setTimeout(() => {
        set({ productIdToOverlay: productId });
      }, 150);
    }
  }
}));
