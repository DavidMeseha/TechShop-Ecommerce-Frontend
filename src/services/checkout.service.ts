import axios from "@/services/api/axios.config";
import { IAddress, IFullProduct, IOrder, IProductAttribute } from "@/types";

type CheckoutDetails = {
  total: number;
  cartItems: { product: IFullProduct; quantity: number; attributes: IProductAttribute[] }[];
  addresses: IAddress[];
  errors: {
    productId: string;
    message: string;
  }[];
};

export async function checkoutData() {
  return axios.get<CheckoutDetails>("/api/v2/checkout/details").then((res) => res.data);
}

export async function preperCardPayment() {
  return axios.get<{ paymentSecret: string }>("/api/v2/checkout/preperPayment");
}

export function placeOrder(form: { billingMethod: string; shippingAddressId: string }) {
  return axios.post<IOrder>(`/api/v2/checkout/submit`, { ...form });
}
