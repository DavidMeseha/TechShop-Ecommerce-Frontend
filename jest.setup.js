import "@testing-library/jest-dom";

jest.mock("embla-carousel-react", () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return [
        jest.fn(),
        {
          scrollTo: jest.fn(),
          canScrollPrev: jest.fn(() => true),
          canScrollNext: jest.fn(() => true),
          on: jest.fn((event, callback) => {
            if (event === "scroll") {
              const emblaApi = { selectedScrollSnap: jest.fn(() => 0) };
              callback(emblaApi);
            }
          }),
          off: jest.fn((event, callback) => {
            if (event === "scroll") callback();
          }),
          destroy: jest.fn()
        }
      ];
    })
  };
});

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn()
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn()
}));

// Mock Zustand stores globally
jest.mock("./src/stores/overlayStore", () => ({
  useOverlayStore: jest.fn(() => ({
    isEditProfileOpen: false,
    isShareOpen: false,
    isProfileMenuOpen: false,
    isHomeMenuOpen: false,
    isSearchOpen: false,
    isAdvancedSearchOpen: false,
    isAddAddressOpen: false,
    isLoginOpen: false,
    isRegisterOpen: false,

    switchSignupOverlay: jest.fn((_isLoginOpen) => {}),
    setIsRegisterOpen: jest.fn((_isOpen) => {}),
    setIsLoginOpen: jest.fn((_isOpen) => {}),
    setIsHomeMenuOpen: jest.fn((_isOpen) => {}),
    setIsAddAddressOpen: jest.fn((_isOpen) => {}),
    setIsEditProfileOpen: jest.fn((_isOpen) => {}),
    setIsProfileMenuOpen: jest.fn((_isOpen) => {}),
    setIsAdvancedSearchOpen: jest.fn((_isOpen) => {}),
    setIsSearchOpen: jest.fn((_isOpen) => {})
  }))
}));

jest.mock("./src/stores/userStore", () => ({
  useUserStore: () => ({
    user: {
      _id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      imageUrl: "/images/avatar.png",
      language: "en",
      isRegistered: true,
      isVendor: false
    },
    reviews: ["product1", "product2"],
    cartItems: [
      { product: "product1", quantity: 1 },
      { product: "product2", quantity: 1 }
    ],
    saves: ["product1", "product2"],
    followedVendors: ["vendor1", "vendor2"],
    likes: ["product2", "product1"],

    getFollowedVendors: jest.fn(async () => {}),
    addToFollowedVendors: jest.fn((_vendorId) => {}),
    removeFromFollowedVendors: jest.fn((_vendorId) => {}),

    getReviews: jest.fn(async () => {}),

    setUser: jest.fn((_user) => {}),
    setUserActions: jest.fn(async () => {}),

    getLikes: jest.fn(async () => {}),
    removeFromLikes: jest.fn((_id) => {}),
    addToLikes: jest.fn((_id) => {}),

    getSaves: jest.fn(async () => {}),
    removeFromSaves: jest.fn((_id) => {}),
    addToSaves: jest.fn((_id) => {}),

    getCartItems: jest.fn(async () => {}),
    addToCart: jest.fn((_id, _quantity) => {}),
    removeFromCart: jest.fn((_id) => {})
  })
}));

jest.mock("./src/stores/productStore", () => ({
  useProductStore: jest.fn(() => ({
    isProductAttributesOpen: false,
    isAddReviewOpen: false,
    isProductMoreInfoOpen: false,
    action: undefined,
    productIdToOverlay: undefined,

    setIsProductMoreInfoOpen: jest.fn((_isOpen, _productId) => {}),
    setIsAddReviewOpen: jest.fn((_isOpen, _productId) => {}),
    setIsProductAttributesOpen: jest.fn((_isOpen, _productId, _action) => {})
  }))
}));

jest.mock("./src/lib/axios.ts");
jest.mock("react-scan", () => ({ scan: jest.fn }));
