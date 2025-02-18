import axios from "@/lib/axios";
import { IFullProduct, IProductAttribute } from "@/types";

export async function homeFeed({ page, limit }: { page: number; limit: number }) {
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
