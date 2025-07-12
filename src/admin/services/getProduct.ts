import { IFullProduct } from "@/types";
import api from "../../common/services/api/adminApi.config";

export default async function getProduct(id: string) {
  return api.get<IFullProduct>("/api/v1/admin/product/" + id).then((data) => data.data);
}
