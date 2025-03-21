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
  cartItems: ["product1", "product2"],

  setUser: jest.fn((user: User | null) => {
    mockUserStore.user = user;
  }),

  getCartItems: jest.fn(async () => {})
};
