"use server";

import { ICategory, IFullProduct, ITag, IVendor, Pagination } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

export default async function prefetchServerRepo() {
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${(await cookies()).get("token")?.value}`
    }
  });

  const getProductsByVendor = async (vendorId: string, params: { page: number; limit: number }) => {
    return api
      .get<{
        data: IFullProduct[];
        pages: Pagination;
      }>(`/api/catalog/VendorProducts/${vendorId}`, { params })
      .then((res) => res.data);
  };

  const getProductsByCategory = async (categoryId: string, params: { page: number }) => {
    return api
      .get<{ data: IFullProduct[]; pages: Pagination }>(`/api/catalog/CategoryProducts/${categoryId}`, { params })
      .then((res) => res.data);
  };

  const getProductsByTag = async (tagId: string, params: { page: number }) => {
    return api
      .get<{ data: IFullProduct[]; pages: Pagination }>(`/api/Catalog/TagProducts/${tagId}`, { params })
      .then((res) => res.data);
  };

  const getTagInfo = async (seName: string) => {
    return await api.get<ITag>(`/api/Catalog/tag/${seName}`).then((res) => res.data);
  };

  const getVendorInfo = async (seName: string) => {
    return api.get<IVendor>(`/api/catalog/vendor/${seName}`).then((res) => res.data);
  };

  const getCategoryInfo = async (seName: string) => {
    return api.get<ICategory>(`/api/Catalog/Category/${seName}`).then((res) => res.data);
  };

  return { getProductsByVendor, getProductsByCategory, getTagInfo, getVendorInfo, getProductsByTag, getCategoryInfo };
}
