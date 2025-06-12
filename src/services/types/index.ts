import { IAddress, IFullProduct, IProductAttribute } from "@/types";

export interface CheckoutDetails {
  total: number;
  cartItems: { product: IFullProduct; quantity: number; attributes: IProductAttribute[] }[];
  addresses: IAddress[];
  errors: {
    productId: string;
    message: string;
  }[];
}

export interface UserProductActions {
  isLiked: boolean;
  isSaved: boolean;
  isInCart: boolean;
  isReviewed: boolean;
}

export interface UserProfile {
  email: string;
  gender: string;
  firstName: string;
  lastName: string;
  dateOfBirthDay: number;
  dateOfBirthMonth: number;
  dateOfBirthYear: number;
  phone: string;
  imageUrl: string;
  ordersCount: number;
}
