import axios from "@/lib/axios";
import { IFullProduct } from "@/types";

const createProduct = async (product: IFullProduct) => {
  return axios.post("/products", { product: { ...product } });
};

export default createProduct;
