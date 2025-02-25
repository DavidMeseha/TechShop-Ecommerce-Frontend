import { create } from "zustand";
import { IProductAttribute } from "@/types";

type Store = {
  isProductAttributesOpen: boolean;
  isAddReviewOpen: boolean;
  isProductMoreInfoOpen: boolean;

  action: ((attr: IProductAttribute[]) => void) | undefined;
  productIdToOverlay: string | undefined;

  setIsProductMoreInfoOpen: (isOpen: boolean, productId?: string) => void;
  setIsAddReviewOpen: (isOpen: boolean, productId?: string) => void;
  setIsProductAttributesOpen: (
    isOpen: boolean,
    productId?: string,
    action?: (attr: IProductAttribute[]) => void
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

  setIsProductMoreInfoOpen: (isOpen: boolean, productId?: string) =>
    set({ isProductMoreInfoOpen: isOpen, productIdToOverlay: productId }),
  setIsAddReviewOpen: (isOpen: boolean, productId?: string) =>
    set(() => ({
      isAddReviewOpen: isOpen,
      productIdToOverlay: productId
    })),
  setIsProductAttributesOpen: (isOpen: boolean, productId?: string, action?: (attr: IProductAttribute[]) => void) => {
    set({
      isProductAttributesOpen: isOpen,
      productIdToOverlay: productId
    });

    setTimeout(() => {
      set({ action: action });
    }, 150);
  }
}));
