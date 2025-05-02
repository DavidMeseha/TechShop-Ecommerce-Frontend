"server-only";

import { IFullProduct, Pagination } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export default async function productsServerRepo() {
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer${(await cookies()).get("session")?.value}`
    }
  });

  const getProductsByVendor = async (vendorId: string, params: { page: number; limit: number }) => {
    return axios
      .get<{
        data: IFullProduct[];
        pages: Pagination;
      }>(`/api/catalog/VendorProducts/${vendorId}`, { params })
      .then((res) => res.data);
  };

  return { getProductsByVendor };
}