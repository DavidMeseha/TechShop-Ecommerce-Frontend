import en from "@/common/dictionaries/en.json";

export type FieldError = string | null | undefined;

export type Language = "en" | "ar" | "fr";
export type Translation = typeof en;
export type TranslationKey = keyof typeof en;
export type TFunction = (key: TranslationKey) => string;

export interface Pagination {
  current: number;
  limit: number;
  hasNext: boolean;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  isVendor: boolean;
  isRegistered: boolean;
  imageUrl: string;
  language: Language;
}

export interface IOrder {
  _id: string;
  customer: IUser;
  billingStatus: string;
  billingMethod: string;
  shippingAddress: IAddress;
  shippingStatus: string;
  items: {
    product: IFullProduct;
    quantity: number;
    attributes: IProductAttribute[];
  }[];
  subTotal: number;
  totalValue: number;
  shippingFees: number;
  codFees: number;
}

export interface ICountry {
  _id: string;
  name: string;
  code: string;
  cities: ICity[];
}

export interface ICity {
  _id: string;
  name: string;
  code: string;
}

export interface IAddress {
  _id: string;
  address: string;
  city: ICity;
  country: ICountry;
}

export interface ICategory {
  name: string;
  seName: string;
  productsCount: number;
  _id: string;
}

export interface IPicture {
  imageUrl: string;
  _id: string;
}

export interface IPrice {
  old: number;
  price: number;
}

export interface IProductAttribute {
  _id: string;
  name: string;
  attributeControlType: string;
  values: IProductAttributeValue[];
}

export interface ICustomeProductAttribute {
  _id: string;
  values: { _id: string }[];
}

export interface IProductAttributeValue {
  _id: string;
  name: string;
  priceAdjustmentValue: number;
  colorRgb?: string;
}

export interface IProductReview {
  product?: IFullProduct;
  customer: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    _id: string;
  };
  reviewText: string;
  rating: number;
  _id: string;
  createdAt: string;
}

export interface IVendor {
  name: string;
  seName: string;
  imageUrl: string;
  productCount: number;
  followersCount: number;
  isFollowed: boolean;
  _id: string;
}

export interface ITag {
  name: string;
  seName: string;
  productCount: number;
  _id: string;
}

export interface IFullProduct {
  gender: string[];
  category: ICategory;
  pictures: IPicture[];
  name: string;
  shortDescription: string;
  fullDescription: string;
  seName: string;
  sku: string;
  vendor: IVendor;
  price: IPrice;
  productTags: string[];
  productAttributes: IProductAttribute[];
  hasAttributes: boolean;
  productReviewOverview: {
    ratingSum: number;
    totalReviews: number;
  };
  likes: number;
  carts: number;
  saves: number;
  productReviews: IProductReview[];
  deleted: boolean;
  inStock: boolean;
  stock: number;
  _id: string;
  updatedAt: string;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isReviewed: boolean;
  isInCart: boolean;
}

export interface Paginated<Data> {
  data: Data[];
  pages: Pagination;
}
