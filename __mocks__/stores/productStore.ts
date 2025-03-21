import { jest } from "@jest/globals";

export const mockProductStore = {
  isProductAttributesOpen: false,
  isAddReviewOpen: false,
  isProductMoreInfoOpen: false,
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

  setIsProductAttributesOpen: jest.fn((isOpen: boolean, productId?: string) => {
    mockProductStore.isProductAttributesOpen = isOpen;
    if (isOpen) {
      mockProductStore.productIdToOverlay = productId;
    } else {
      mockProductStore.productIdToOverlay = undefined;
    }
  })
};
