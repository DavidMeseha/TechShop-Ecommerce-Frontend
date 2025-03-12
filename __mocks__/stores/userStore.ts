import { UserStore } from "@/stores/userStore";
import { User } from "@/types";
import { jest } from "@jest/globals";

const mockUser: User = {
  _id: "test-user-id",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  imageUrl: "/images/avatar.png",
  language: "en",
  isRegistered: true,
  isVendor: false
};

export const mockUserStore: UserStore = {
  user: mockUser,
  reviews: ["product1", "product2"],
  cartItems: [
    { product: "product1", quantity: 1 },
    { product: "product2", quantity: 1 }
  ],
  saves: ["product1", "product2"],
  followedVendors: ["vendor1", "vendor2"],
  likes: ["product2", "product1"],
  lastPageBeforSignUp: "/",

  setLastPageBeforSignUp(page: string) {
    mockUserStore.lastPageBeforSignUp = page;
  },
  getFollowedVendors: jest.fn(async () => {}),
  addToFollowedVendors: jest.fn((vendorId: string) => {
    mockUserStore.followedVendors.push(vendorId);
  }),
  removeFromFollowedVendors: jest.fn((vendorId: string) => {
    const index = mockUserStore.followedVendors.indexOf(vendorId);
    if (index > -1) mockUserStore.followedVendors.splice(index, 1);
  }),

  getReviews: jest.fn(async () => {}),

  setUser: jest.fn((user: User | null) => {
    mockUserStore.user = user;
  }),
  setUserActions: jest.fn(async () => {}),

  getLikes: jest.fn(async () => {}),
  removeFromLikes: jest.fn((id: string) => {
    const index = mockUserStore.likes.indexOf(id);
    if (index > -1) mockUserStore.likes.splice(index, 1);
  }),
  addToLikes: jest.fn((id: string) => {
    mockUserStore.likes.push(id);
  }),

  getSaves: jest.fn(async () => {}),
  removeFromSaves: jest.fn((id: string) => {
    const index = mockUserStore.saves.indexOf(id);
    if (index > -1) mockUserStore.saves.splice(index, 1);
  }),
  addToSaves: jest.fn((id: string) => {
    mockUserStore.saves.push(id);
  }),

  getCartItems: jest.fn(async () => {}),
  addToCart: jest.fn((id: string, quantity: number = 1) => {
    mockUserStore.cartItems.push({ product: id, quantity });
  }),
  removeFromCart: jest.fn((id: string) => {
    const index = mockUserStore.cartItems.findIndex((item) => item.product === id);
    if (index > -1) mockUserStore.cartItems.splice(index, 1);
  })
};
