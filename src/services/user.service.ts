import axios from "@/lib/axios";
import { IAddress, IFullProduct, IOrder, IProductReview, IVendor, Pagination, UserInfoForm } from "@/types";
import { UserProfile } from "./types";

export async function userAdresses() {
  return axios.get<IAddress[]>("/api/v2/user/addresses").then((res) => res.data);
}

export async function newAddress(address: { city: string; country: string; address: string }) {
  return axios.post("/api/v2/user/addresses/add", { ...address });
}

export async function deleteAddress(id: string) {
  return axios.delete(`/api/v2/user/addresses/delete/${id}`);
}

export async function updateAddress(address: { _id: string; city: string; country: string; address: string }) {
  return axios.put(`/api/v2/user/addresses/edit/${address._id}`, {
    city: address.city,
    country: address.country,
    address: address.address
  });
}

export async function getSavedProducts() {
  return axios.get<IFullProduct[]>("/api/v2/user/savedProducts").then((res) => res.data);
}

export async function getCartProducts() {
  return axios.get<IFullProduct[]>("/api/v2/user/cart/products").then((res) => res.data);
}

export async function getUserInfo() {
  return axios.get<UserProfile>("/api/v2/user/info").then((res) => res.data);
}

export async function updateUserInfo(userInfo: UserInfoForm) {
  return axios.put("/api/v2/user/info", { ...userInfo });
}

export async function getFollowingVendors() {
  return axios.get<IVendor[]>("/api/v2/user/followingVendors").then((res) => res.data);
}

export async function getOrder(id: string) {
  return axios.get<IOrder>(`/api/v2/user/order/${id}`).then((res) => res.data);
}

export async function getOrders() {
  return axios.get<IOrder[]>("/api/v2/user/orders").then((res) => res.data);
}

export async function getUserReviews(params: { page: number }) {
  return axios
    .get<{ data: IProductReview[]; pages: Pagination }>("/api/v2/user/reviews", { params })
    .then((res) => res.data);
}

export async function vendorIsFollowed(seName: string) {
  return axios.get<IVendor>(`/api/v2/catalog/vendor/${seName}`).then((res) => res.data.isFollowed);
}
