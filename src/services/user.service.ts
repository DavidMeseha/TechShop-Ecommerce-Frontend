import axios from "@/lib/axios";
import {
  IAddress,
  IFullProduct,
  IOrder,
  IProductAttribute,
  IProductReview,
  IVendor,
  Pagination,
  UserInfoForm,
  UserProfile
} from "@/types";

export async function userAdresses() {
  return axios.get<IAddress[]>("/api/user/addresses").then((res) => res.data);
}

export async function newAddress(address: { city: string; country: string; address: string }) {
  return axios.post("/api/user/addresses/add", { ...address });
}

export async function deleteAddress(id: string) {
  return axios.delete(`/api/user/address/delete/${id}`);
}

export async function updateAddress(address: { _id: string; city: string; country: string; address: string }) {
  return axios.put(`/api/user/addresses/edit/${address._id}`, {
    city: address.city,
    country: address.country,
    address: address.address
  });
}

export async function citiesInCountry(countryId: string) {
  return axios
    .get<{ name: string; code: string; _id: string }[]>(`/api/common/cities/${countryId}`)
    .then((res) => res.data);
}

export async function getSavedProducts() {
  return axios.get<IFullProduct[]>("/api/user/savedProducts").then((res) => res.data);
}

export async function getCartProducts() {
  return axios
    .get<{ product: IFullProduct; quantity: number; attributes: IProductAttribute[] }[]>("/api/common/cart")
    .then((res) => res.data);
}

export async function getUserInfo() {
  return axios.get<UserProfile>("/api/user/info").then((res) => res.data);
}

export async function updateUserInfo(userInfo: UserInfoForm) {
  return axios.put("/api/user/info", { ...userInfo });
}

export async function getFollowingVendors() {
  return axios.get<IVendor[]>("/api/user/followingVendors").then((res) => res.data);
}

export async function getOrder(id: string) {
  return axios.get<IOrder>(`/api/user/order/${id}`).then((res) => res.data);
}

export async function getOrders() {
  return axios.get<IOrder[]>("/api/user/orders").then((res) => res.data);
}

export async function getUserReviews(params: { page: number }) {
  return axios
    .get<{ data: IProductReview[]; pages: Pagination }>("/api/user/reviews", { params })
    .then((res) => res.data);
}
