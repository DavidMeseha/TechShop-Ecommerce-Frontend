import axios from "@/web/services/api/api.config";
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

export async function addReview(productId: string, form: { reviewText: string; rating: number }) {
  return axios.post(`/api/v2/user/actions/addReview/${productId}`, { ...form });
}

export async function getCartIds() {
  try {
    const res = await axios.get<string[]>("/api/v2/user/cart/ids");
    return res.data;
  } catch {
    return [];
  }
}
