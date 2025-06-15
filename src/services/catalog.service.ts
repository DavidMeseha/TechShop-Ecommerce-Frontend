import axios from "@/services/api/axios.config";
import { ICategory, IFullProduct, IProductAttribute, ITag, IVendor } from "@/types";
import { UserProductActions } from "./types";
import { Paginated } from "../types";

interface IProductAttributesResponse {
  _id: string;
  productAttributes: IProductAttribute[];
  hasAttributes: boolean;
  seName: string;
  name: string;
  stock: number;
}

export async function homeFeedProducts({ page, limit }: { page: number; limit: number }) {
  return axios
    .get<Paginated<IFullProduct>>("/api/v2/catalog/homefeed", {
      params: { page, limit }
    })
    .then((res) => res.data);
}

export async function getProductDetails(seName: string) {
  return axios.get<IFullProduct>(`/api/v2/catalog/product/${seName}`).then((res) => res.data);
}

export async function getProductAttributes(seName?: string) {
  if (!seName) throw new Error("seName not passed");
  return axios.get<IProductAttributesResponse>(`/api/v2/product/attributes/${seName}`).then((res) => res.data);
}

export async function getVendors(params: { page: number; limit: number }) {
  return axios.get<Paginated<IVendor>>("/api/v2/catalog/discover/vendors", { params }).then((res) => res.data);
}

export async function getCategories(params: { page: number }) {
  return axios.get<Paginated<ICategory>>("/api/v2/catalog/discover/categories", { params }).then((res) => res.data);
}

export async function getTags(params: { page: number; limit: number }) {
  return axios.get<Paginated<ITag>>("/api/v2/catalog/discover/tags", { params }).then((res) => res.data);
}

export async function getProductsByCateory(categoryId: string, params: { page: number }) {
  return axios
    .get<Paginated<IFullProduct>>(`/api/v2/catalog/Category/products/${categoryId}`, { params })
    .then((res) => res.data);
}

export async function getProductsByTag(tagId: string, params: { page: number }) {
  return axios
    .get<Paginated<IFullProduct>>(`/api/v2/Catalog/tag/products/${tagId}`, { params })
    .then((res) => res.data);
}

export async function getProductsByVendor(vendorId: string, params: { page: number; limit: number }) {
  return axios
    .get<Paginated<IFullProduct>>(`/api/v2/catalog/vendor/products/${vendorId}`, { params })
    .then((res) => res.data);
}

export async function getProductUserActions(seName: string) {
  return axios.get<UserProductActions>(`/api/v2/product/actions/${seName}`).then((res) => res.data);
}

export async function getCategoryInfo(seName: string) {
  return axios.get<ICategory>(`/api/v2/catalog/category/${seName}`).then((res) => res.data);
}

export async function getVendorInfo(seName: string) {
  return axios.get<IVendor>(`/api/v2/catalog/vendor/${seName}`).then((res) => res.data);
}

export async function getTagInfo(seName: string) {
  return axios.get<ITag>(`/api/v2/catalog/tag/${seName}`).then((res) => res.data);
}

export async function getProduct(seName: string) {
  return axios.get<IFullProduct>(`/api/v2/product/${seName}`).then((res) => res.data);
}
