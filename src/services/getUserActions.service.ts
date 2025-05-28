import axios from "@/lib/axios";

export async function getCartIds() {
  try {
    const res = await axios.get<string[]>("/api/v2/user/cart/ids");
    return res.data;
  } catch {
    return [];
  }
}
