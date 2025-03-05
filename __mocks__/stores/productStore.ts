import { IProductAttribute } from "@/types";
import { jest } from "@jest/globals";

export const mockProductStore = {
  isProductAttributesOpen: false,
  isAddReviewOpen: false,
  isProductMoreInfoOpen: false,
  action: undefined as ((attr: IProductAttribute[]) => void) | undefined,
  productIdToOverlay: undefined as string | undefined,

  setIsProductMoreInfoOpen: jest.fn((isOpen: boolean, productId?: string) => {
    mockProductStore.isProductMoreInfoOpen = isOpen;
    if (isOpen) {
      mockProductStore.productIdToOverlay = productId;
    } else {
      mockProductStore.productIdToOverlay = undefined;
    }
  }),

  setIsAddReviewOpen: jest.fn((isOpen: boolean, productId?: string) => {
    mockProductStore.isAddReviewOpen = isOpen;
    if (isOpen) {
      mockProductStore.productIdToOverlay = productId;
    } else {
      mockProductStore.productIdToOverlay = undefined;
    }
  }),

  setIsProductAttributesOpen: jest.fn(
    (isOpen: boolean, productId?: string, action?: (attr: IProductAttribute[]) => void) => {
      mockProductStore.isProductAttributesOpen = isOpen;
      if (isOpen) {
        mockProductStore.productIdToOverlay = productId;
        mockProductStore.action = action;
      } else {
        mockProductStore.productIdToOverlay = undefined;
        mockProductStore.action = undefined;
      }
    }
  )
};
