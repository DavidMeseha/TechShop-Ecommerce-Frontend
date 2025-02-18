import axios from "@/lib/axios";
import { IAddress, IFullProduct, IOrder, IProductAttribute } from "@/types";

export async function checkoutData() {
  return axios
    .get<{
      total: number;
      cartItems: { product: IFullProduct; quantity: number; attributes: IProductAttribute[] }[];
      addresses: IAddress[];
    }>("/api/common/checkout")
    .then((res) => res.data);
}

export async function preperCardPayment() {
  return axios.get<{ paymentSecret: string }>("/api/user/preperPayment");
}

export function placeOrder(form: { billingMethod: string; billingStatus: string; shippingAddressId: string }) {
  return axios.post<IOrder>(`/api/user/order/submit`, {
    ...form
  });
}
