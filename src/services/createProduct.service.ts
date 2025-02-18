import axios from "@/lib/axios";
import { IFullProduct } from "@/types";

const createProduct = async (product: IFullProduct) => {
  try {
    await axios.post("/products", { product: { ...product } });
    return true;
  } catch {
    return false;
  }
};

export default createProduct;
