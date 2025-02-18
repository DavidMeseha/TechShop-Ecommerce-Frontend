import { GeneralStore } from "@/stores/appStore";
import { UserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { create } from "zustand";

export const mockGeneralStore = create<GeneralStore>()((set) => ({
  isEditProfileOpen: false,
  isShareOpen: false,
  isAddToCartOpen: false,
  isProfileMenuOpen: false,
  isProductMoreInfoOpen: false,
  isHomeMenuOpen: false,
  isSearchOpen: false,
  isAdvancedSearchOpen: false,
  isAddReviewOpen: false,
  isAddAddressOpen: false,

  //overlay data
  shareUrl: "",
  search: "",
  overlayProduct: null,
  overlayProductId: null,
  action: { name: null, fn: null },
  countries: [],
  shareAction: () => {},

  //overlay toggles
  setIsHomeMenuOpen: jest.fn(),
  setIsAddAddressOpen: jest.fn(),
  setIsEditProfileOpen: jest.fn(),
  setIsProfileMenuOpen: jest.fn(),
  setIsAdvancedSearchOpen: jest.fn(),
  setIsSearchOpen: jest.fn(),
  setSearch: jest.fn(),
  setIsProductMoreInfoOpen: jest.fn(),
  setShare: jest.fn(),
  setIsAddReviewOpen: jest.fn(),
  setCountries: () =>
    set({
      countries: [
        { name: "Country 1", _id: "1", code: "c1" },
        { name: "Country 1", _id: "1", code: "c1" }
      ]
    }),
  setIsProductAttributesOpen: jest.fn()
}));

export const mockUserStore = create<UserStore>()((set) => ({
  user: null,
  reviews: [],
  cartItems: [],
  saves: [],
  likes: [],
  following: [],

  setReviews: async () => {
    set({ reviews: ["1", "2"] });
  },
  setLikes: async () => {
    set({ likes: ["1", "2"] });
  },
  setCartItems: async () => {
    const result = [
      { product: "1", quantity: 1 },
      { product: "2", quantity: 2 }
    ];
    set({ cartItems: result });
  },
  setSaves: async () => {
    const result = ["1", "2"];
    set({ saves: result });
  },
  setFollowedVendors: async () => {
    const result = ["1", "2"];
    set({ following: result });
  },
  setUser: (user) => set({ user }),
  setUserActions: jest.fn()
}));

export const mockHomeProduct: IFullProduct = {
  price: { old: 0, price: 1200 },
  productReviewOverview: { ratingSum: 7, totalReviews: 2 },
  gender: ["male"],
  _id: "66fea6938acf991defe84869",
  name: "Build your own computer",
  shortDescription: "Some Short discriptiong longer than title",
  seName: "Build_your_own_computer",
  sku: "BYOC_SKU",
  hasAttributes: true,
  inStock: true,
  likes: 6,
  carts: 2,
  saves: 4,
  productReviews: [
    {
      customer: {
        firstName: "",
        lastName: "",
        imageUrl: "",
        _id: ""
      },
      reviewText: "",
      rating: 3,
      _id: "",
      createdAt: ""
    }
  ],
  vendor: {
    _id: "66fe9a52b755ada451933c93",
    name: "Admin",
    seName: "Admin",
    imageUrl: "http://localhost:3000/images/profile_placeholder.jpg",
    productCount: 4,
    followersCount: 5
  },
  productTags: [
    { _id: "6710d2b01db8444519ac2f50", name: "laptop", seName: "laptop", productCount: 2 },
    { _id: "6710d53dceb7f2223ed2b60d", name: "electronics", seName: "electronics", productCount: 4 }
  ],
  productAttributes: [
    {
      name: "Processor",
      attributeControlType: "DropdownList",
      values: [
        { name: "2.2 GHz Intel Pentium Dual-Core E2200", priceAdjustmentValue: 0, _id: "66fea6938acf991defe8486b" },
        { name: "2.5 GHz Intel Pentium Dual-Core E2200", priceAdjustmentValue: 15, _id: "66fea6938acf991defe8486c" }
      ],
      _id: "66fea6938acf991defe8486a"
    },
    {
      name: "RAM",
      attributeControlType: "RadioList",
      values: [
        { name: "2 GB", priceAdjustmentValue: 0, _id: "66fea6938acf991defe8486e" },
        { name: "4GB", priceAdjustmentValue: 20, _id: "66fea6938acf991defe8486f" },
        { name: "8GB", priceAdjustmentValue: 60, _id: "66fea6938acf991defe84870" }
      ],
      _id: "66fea6938acf991defe8486d"
    },
    {
      name: "HDD",
      attributeControlType: "RadioList",
      values: [
        { name: "320 GB", priceAdjustmentValue: 0, _id: "66fea6938acf991defe84872" },
        { name: "400 GB", priceAdjustmentValue: 100, _id: "66fea6938acf991defe84873" }
      ],
      _id: "66fea6938acf991defe84871"
    },
    {
      name: "OS",
      attributeControlType: "RadioList",
      values: [
        { name: "Vista Home", priceAdjustmentValue: 50, _id: "66fea6938acf991defe84875" },
        { name: "Vista Premium", priceAdjustmentValue: 60, _id: "66fea6938acf991defe84876" }
      ],
      _id: "66fea6938acf991defe84874"
    },
    {
      name: "Software",
      attributeControlType: "Checkboxes",
      values: [
        { name: "Microsoft Office", priceAdjustmentValue: 50, _id: "66fea6938acf991defe84878" },
        { name: "Acrobat Reader", priceAdjustmentValue: 10, _id: "66fea6938acf991defe84879" },
        { name: "Total Commander", priceAdjustmentValue: 5, _id: "66fea6938acf991defe8487a" }
      ],
      _id: "66fea6938acf991defe84877"
    }
  ],
  updatedAt: "2024-11-04T12:27:01.091Z",
  category: { _id: "670026e315a76efbfcedc60b", name: "category", seName: "category", productsCount: 1 },
  pictures: [{ _id: "672b196a6446bb4903c47df2", imageUrl: "http://localhost:3000/images/no_image_placeholder.jpg" }],
  fullDescription:
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis aspernatur nemo aliquid, sint ab possimus quis numquam animi unde. Sunt non obcaecati laudantium ut at sint nemo iste accusantium soluta, ab tenetur quam cupiditate aspernatur sequi maxime pariatur impedit consequuntur voluptatum vitae quod! Ut error laborum, natus veniam enim omnis ab sunt, deleniti pariatur libero labore beatae? Odit harum nulla autem esse impedit, quod accusantium quaerat. Minima excepturi amet inventore maiores eaque, impedit iure qui, non magnam tempore omnis tenetur eum minus facilis, deserunt numquam ex distinctio necessitatibus fuga accusamus sint possimus. Commodi illum tempora deleniti ex dignissimos ad consequuntur!"
};
