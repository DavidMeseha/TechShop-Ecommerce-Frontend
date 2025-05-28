import axios from "@/lib/axios";
import { ICustomeProductAttribute } from "@/types";

export async function removeFromCart(id: string) {
  return axios.delete(`/api/v2/user/cart/remove/${id}`);
}

export async function addToCart(id: string, attributes: ICustomeProductAttribute[], quantity: number) {
  return axios.post(`/api/v2/user/cart/add/${id}`, { attributes, quantity });
}

export async function likeProduct(id: string) {
  return axios.post(`/api/v2/user/actions/likeProduct/${id}`);
}

export async function unLikeProduct(id: string) {
  return axios.post(`/api/v2/user/actions/unlikeProduct/${id}`);
}

export async function followVendor(id: string) {
  return axios.post(`/api/v2/user/actions/followVendor/${id}`);
}

export async function unfollowVendor(id: string) {
  return axios.post(`/api/v2/user/actions/unfollowVendor/${id}`);
}

export async function saveProduct(id: string) {
  return axios.post(`/api/v2/user/actions/saveProduct/${id}`);
}

export async function unsaveProduct(id: string) {
  return axios.post(`/api/v2/user/actions/unsaveProduct/${id}`);
}
