import axios from "@/lib/axios";
import { ICategory, IFullProduct, IProductAttribute, ITag, IVendor, Pagination } from "@/types";

export async function homeFeedProducts({ page, limit }: { page: number; limit: number }) {
  return axios
    .get<{ data: IFullProduct[] }>("/api/catalog/homefeed", {
      params: { page, limit }
    })
    .then((res) => res.data.data);
}

export async function getProductDetails(id: string) {
  return axios.get<IFullProduct>(`/api/catalog/product/${id}`).then((res) => res.data);
}

export async function getProductAttributes(id: string) {
  return axios
    .get<{
      _id: string;
      productAttributes: IProductAttribute[];
      name: string;
    }>(`/api/product/attributes/${id}`)
    .then((res) => res.data);
}

export async function addReview(productId: string, form: { reviewText: string; rating: number }) {
  return axios.post(`/api/user/addReview/${productId}`, { ...form });
}

export async function getVendors(params: { page: number }) {
  return axios
    .get<{ data: IVendor[]; pages: Pagination }>("/api/catalog/discover/vendors", { params })
    .then((res) => res.data);
}

export async function getCategories(params: { page: number }) {
  return axios
    .get<{ data: ICategory[]; pages: Pagination }>("/api/catalog/discover/categories", { params })
    .then((res) => res.data);
}

export async function getTags(params: { page: number }) {
  return axios
    .get<{ data: ITag[]; pages: Pagination }>("/api/catalog/discover/tags", { params })
    .then((res) => res.data);
}

export async function getProductsByCateory(categoryId: string, params: { page: number }) {
  return axios
    .get<{ data: IFullProduct[]; pages: Pagination }>(`/api/catalog/CategoryProducts/${categoryId}`, { params })
    .then((res) => res.data);
}

export async function getProductsByTag(tagId: string, params: { page: number }) {
  return axios
    .get<{ data: IFullProduct[]; pages: Pagination }>(`/api/Catalog/TagProducts/${tagId}`, { params })
    .then((res) => res.data);
}

export async function getProductsByVendor(vendorId: string, params: { page: number }) {
  return axios
    .get<{ data: IFullProduct[]; pages: Pagination }>(`/api/catalog/VendorProducts/${vendorId}`, { params })
    .then((res) => res.data);
}
