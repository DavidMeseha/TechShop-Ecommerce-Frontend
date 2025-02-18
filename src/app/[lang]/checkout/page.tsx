"use client";

import { useState } from "react";
import CartItem from "../../../components/CartItem";
import { useRouter } from "next-nprogress-bar";
import BackArrow from "@/components/ui/BackArrow";
import { useTranslation } from "@/context/Translation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import FormDropdownInput from "@/components/FormDropdownInput";
import { useAppStore } from "@/stores/appStore";
import RadioGroup from "@/components/RadioGroup";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { checkoutData, placeOrder, preperCardPayment } from "@/services/checkout.service";

interface ICheckoutForm {
  shippingAddressId: string;
  billingMethod: string;
  billingStatus: string;
}

const initialCheckoutForm: ICheckoutForm = {
  billingMethod: "cod",
  billingStatus: "cod",
  shippingAddressId: ""
};

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [activeTap, setActiveTap] = useState<"shipping" | "billing" | "summary">("shipping");
  const [form, setForm] = useState(initialCheckoutForm);
  const { setIsAddAddressOpen } = useAppStore();
  const { t } = useTranslation();
  const [orderProcessing, setIsProcessing] = useState(false);

  const placeOrderMutation = useMutation({
    mutationKey: ["placeOrder"],
    mutationFn: () => placeOrder(form),
    onSuccess: (res) => {
      router.push(`/order-success/${res.data._id}`);
    }
  });

  const preperPaymentMutation = useMutation({
    mutationKey: ["preperPayment"],
    mutationFn: () => preperCardPayment()
  });

  const checkoutQuery = useQuery({
    queryKey: ["checkoutData"],
    queryFn: () =>
      checkoutData().then((data) => {
        setForm({ ...form, shippingAddressId: data.addresses[0]._id });
        return data;
      })
  });

  const shoppingcartItems = checkoutQuery.data?.cartItems ?? [];
  const addresses = checkoutQuery.data?.addresses ?? [];

  const handleFieldOnChange = (value: string, name: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const process = async () => {
      if (form.billingMethod === "cod") {
        return placeOrderMutation.mutate();
      }

      if (!elements || !stripe) {
        setIsProcessing(false);
        return toast.error("Stripe error, refresh and try again");
      }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setIsProcessing(false);
        return toast.error("Stripe error, refresh and try again");
      }

      // Create payment intent on the server
      const res = await preperPaymentMutation.mutateAsync();
      const paymentSecret = res.data.paymentSecret;
      if (!paymentSecret) {
        setIsProcessing(false);
        return toast.error(t("checkout.failedToVerifyPayment"));
      }

      // Confirm the payment with the card details
      const { error: stripeError } = await stripe.confirmCardPayment(paymentSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (stripeError) {
        setIsProcessing(false);
        return toast.error(t("checkout.failedToVerifyPayment"));
      } else placeOrderMutation.mutate();
    };

    setIsProcessing(true);
    process();
  };

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-30 w-full bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">{t("checkout")}</h1>
          <div className="w-6" />
        </div>
        <ul className="sticky top-11 z-30 flex w-full items-center border-b bg-white">
          <li className={`w-full ${activeTap === "shipping" ? "-mb-0.5 border-b-2 border-b-black" : "text-secondary"}`}>
            <a className="flex justify-center py-2" onClick={() => setActiveTap("shipping")}>
              {t("checkout.shipping")}
            </a>
          </li>
          <li className={`w-full ${activeTap === "summary" ? "-mb-0.5 border-b-2 border-b-black" : "text-secondary"}`}>
            <a className="flex justify-center py-2" onClick={() => setActiveTap("summary")}>
              {t("checkout.products")}
            </a>
          </li>
        </ul>
      </div>
      <div className="sticky top-[60px] z-30 hidden w-full justify-between border-b bg-white pt-4 md:flex">
        <ul className="flex items-center">
          <li
            className={`border-s border-t px-6 ${activeTap === "shipping" ? "-mb-0.5 border-b-2 border-b-black" : "text-secondary"}`}
          >
            <a className="flex justify-center py-2" role="button" onClick={() => setActiveTap("shipping")}>
              {t("checkout.shipping")}
            </a>
          </li>
          <li
            className={`border-x border-t px-6 ${activeTap === "summary" ? "-mb-0.5 border-b-2 border-b-black" : "text-secondary"}`}
          >
            <a className="flex justify-center py-2" role="button" onClick={() => setActiveTap("summary")}>
              {t("checkout.products")}
            </a>
          </li>
        </ul>
        <Button
          className="text-nowrap bg-primary text-white"
          isLoading={orderProcessing || placeOrderMutation.isPending}
          onClick={handleSubmit}
        >
          <div className="flex gap-6">
            <div>
              {t("checkout.placeOrder")}({shoppingcartItems.length})
            </div>
            <div>{checkoutQuery.data?.total}$</div>
          </div>
        </Button>
      </div>
      <div className="mt-10 p-4 md:mt-0 md:p-0 md:py-4">
        {activeTap === "shipping" && (
          <>
            <div className="flex items-start gap-4">
              <div className="grow">
                <FormDropdownInput
                  label=""
                  name="shippingAddressId"
                  value={form.shippingAddressId}
                  options={addresses.map((address) => ({
                    name: address.address,
                    value: address._id
                  }))}
                  onUpdate={handleFieldOnChange}
                />
              </div>
              <Button className="bg-primary text-white" onClick={() => setIsAddAddressOpen(true)}>
                {t("addresses.newAddress")}
              </Button>
            </div>
            <RadioGroup
              className="text-sm"
              title={t("checkout.billingMethod")}
              value={form.billingMethod}
              options={[
                { name: "COD", value: "cod" },
                { name: "Cridet Card", value: "card" }
              ]}
              onChange={(value) => setForm({ ...form, billingMethod: value })}
            />
            {form.billingMethod === "card" ? (
              <CardElement className="mx-auto mt-9 w-auto max-w-[500] rounded-md border p-4" />
            ) : null}
          </>
        )}
        {activeTap === "summary" &&
          shoppingcartItems.map((item) => (
            <CartItem
              attributes={item.attributes}
              key={item.product.seName}
              product={item.product}
              quantity={item.quantity}
            />
          ))}
      </div>
      <div className="fixed bottom-0 start-0 z-30 w-full border border-x-0 bg-white px-6 py-4 md:start-[280px] md:hidden md:w-[calc(100%-280px)]">
        <Button
          className="w-full bg-primary text-white"
          isLoading={placeOrderMutation.isPending}
          onClick={handleSubmit}
        >
          <div className="flex w-full justify-between">
            {t("checkout.placeOrder")}({shoppingcartItems.length})<div>{checkoutQuery.data?.total}$</div>
          </div>
        </Button>
      </div>
    </>
  );
}
