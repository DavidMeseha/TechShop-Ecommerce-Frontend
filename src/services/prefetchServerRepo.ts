"use server";

import { BASE_URL } from "@/lib/axios";
import { ICategory, ITag, IVendor } from "@/types";
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
    return api(`api/Catalog/tag/${seName}`, 3600);
  };

  const getVendorInfo = async (seName: string): Promise<IVendor> => {
    return api(`api/catalog/vendor/${seName}`, 3600);
  };

  const getCategoryInfo = async (seName: string): Promise<ICategory> => {
    return api(`api/Catalog/Category/${seName}`, 3600);
  };

  return {
    getTagInfo,
    getVendorInfo,
    getCategoryInfo
  };
}
