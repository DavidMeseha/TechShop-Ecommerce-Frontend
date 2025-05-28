"use server";

import { BASE_URL } from "@/lib/axios";
import { ICategory, IFullProduct, ITag, IVendor, Pagination } from "@/types";
import { cookies } from "next/headers";

export default async function prefetchServerRepo() {
  const api = async (url: string, revalidate: number = 0) => {
    const response = await fetch(`${BASE_URL}/${url}`, {
      next: { revalidate },
      headers: {
        Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
  };

  const getTagInfo = async (seName: string): Promise<ITag> => {
    return api(`api/v2/Catalog/tag/${seName}`, 3600);
  };

  const getVendorInfo = async (seName: string): Promise<IVendor> => {
    return api(`api/v2/catalog/vendor/${seName}`, 3600);
  };

  const getCategoryInfo = async (seName: string): Promise<ICategory> => {
    return api(`api/v2/Catalog/Category/${seName}`, 3600);
  };

  const getProduct = (seName: string): Promise<IFullProduct> => {
    return api(`api/v2/product/details/${seName}`, 3600);
  };

  const getFeedProducts = ({
    page,
    limit
  }: {
    limit: number;
    page: number;
  }): Promise<{ data: IFullProduct[]; pages: Pagination }> => {
    return api(`api/v2/catalog/homefeed?page=${page}&limit=${limit}`, 0);
  };

  return {
    getTagInfo,
    getVendorInfo,
    getCategoryInfo,
    getProduct,
    getFeedProducts
  };
}
