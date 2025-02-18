import axios from "@/lib/axios";
import { IProductAttribute } from "@/types";

export async function removeFromCart(id: string) {
  return axios.delete(`/api/common/cart/remove/${id}`);
}

export async function addToCart(id: string, attributes: IProductAttribute[], quantity: number) {
  return axios.post(`/api/common/cart/add/${id}`, { attributes, quantity });
}

export async function likeProduct(id: string) {
  return axios.post(`/api/user/likeProduct/${id}`);
}

export async function unLikeProduct(id: string) {
  return axios.post(`/api/user/unlikeProduct/${id}`);
}

export async function followVendor(id: string) {
  return axios.post(`/api/user/followVendor/${id}`);
}

export async function unfollowVendor(id: string) {
  return axios.post(`/api/user/unfollowVendor/${id}`);
}

export async function saveProduct(id: string) {
  return axios.post(`/api/user/saveProduct/${id}`);
}

export async function unsaveProduct(id: string) {
  return axios.post(`/api/user/unsaveProduct/${id}`);
}
