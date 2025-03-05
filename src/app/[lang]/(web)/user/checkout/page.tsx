"use client";

import { useState } from "react";
import CartItem from "@/components/CartItem";
import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import FormDropdownInput from "@/components/FormDropdownInput";
import RadioGroup from "@/components/RadioGroup";
import { CardElement } from "@stripe/react-stripe-js";
import { checkoutData } from "@/services/checkout.service";
import { useOverlayStore } from "@/stores/overlayStore";
import { CheckoutForm } from "@/schemas/valdation";
import usePlaceOrder from "@/hooks/usePlaceOrder";

const initialCheckoutForm: CheckoutForm = {
  billingMethod: "cod",
  shippingAddressId: ""
};

export default function CheckoutPage() {
  const [activeTap, setActiveTap] = useState<"shipping" | "billing" | "summary">(() => "shipping");
  const [form, setForm] = useState(() => initialCheckoutForm);
  const setIsAddAddressOpen = useOverlayStore((state) => state.setIsAddAddressOpen);
  const { t } = useTranslation();
  const { isProcessing, submit } = usePlaceOrder();

  const checkoutQuery = useQuery({
    queryKey: ["cartItems"],
    queryFn: () =>
      checkoutData().then((data) => {
        if (data.addresses.length > 0) setForm({ ...form, shippingAddressId: data.addresses[0]._id });
        return data;
      })
  });
  const shoppingcartItems = checkoutQuery.data?.cartItems ?? [];
  const addresses = checkoutQuery.data?.addresses ?? [];

  return (
    <>
      <div className="sticky top-[60px] z-30 hidden w-full justify-between border-b bg-white pt-4 md:flex">
        <ul className="flex items-center">
          <li
            className={`border-s border-t px-6 ${activeTap === "shipping" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
          >
            <a className="flex justify-center py-2" role="button" onClick={() => setActiveTap("shipping")}>
              {t("checkout.shipping")}
            </a>
          </li>
          <li
            className={`border-x border-t px-6 ${activeTap === "summary" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
          >
            <a className="flex justify-center py-2" role="button" onClick={() => setActiveTap("summary")}>
              {t("checkout.products")}
            </a>
          </li>
        </ul>
        <Button className="text-nowrap bg-primary text-white" isLoading={isProcessing} onClick={() => submit(form)}>
          <div className="flex gap-6">
            <div>
              {t("checkout.placeOrder")}({shoppingcartItems.length})
            </div>
            <div>{checkoutQuery.data?.total}$</div>
          </div>
        </Button>
      </div>

      <ul className="sticky top-11 z-30 flex w-full cursor-pointer border-b bg-white md:hidden">
        <li className={`w-full ${activeTap === "shipping" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}>
          <a className="flex justify-center py-2" onClick={() => setActiveTap("shipping")}>
            {t("checkout.products")}
          </a>
        </li>
        <li className={`w-full ${activeTap === "summary" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}>
          <a className="flex justify-center py-2" onClick={() => setActiveTap("summary")}>
            {t("checkout.shipping")}
          </a>
        </li>
      </ul>

      <div className="p-4 md:p-0 md:py-4">
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
                  onChange={(e) => setForm({ ...form, shippingAddressId: e.currentTarget.value })}
                />
              </div>
              <Button className="bg-primary text-white" onClick={() => setIsAddAddressOpen(true)}>
                {t("addresses.newAddress")}
              </Button>
            </div>

            <RadioGroup
              checkedValue={form.billingMethod}
              className="text-sm"
              title={t("checkout.billingMethod")}
              options={[
                { name: "COD", value: "cod" },
                { name: "Cridet Card", value: "card" }
              ]}
              onChange={(e) => setForm({ ...form, billingMethod: e.currentTarget.value })}
            />

            {form.billingMethod === "card" ? (
              <>
                <CardElement className="mx-auto mt-9 w-auto max-w-[500] rounded-md border p-4" />
                <div className="text-center text-sm text-gray-400">
                  <div>Test Cridet card N: 4242 4242 4242 4242</div>
                  <div>expiry: any futural month/year</div>
                  <div>passcode: any 3 numbers</div>
                  <div>ZIP: any 5 numbers</div>
                </div>
              </>
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
      <div className="fixed bottom-0 start-0 z-30 w-full border border-x-0 bg-white px-6 py-4 md:hidden">
        <Button className="w-full bg-primary text-white" isLoading={isProcessing} onClick={() => submit(form)}>
          <div className="flex w-full justify-between">
            {t("checkout.placeOrder")}({shoppingcartItems.length})<div>{checkoutQuery.data?.total}$</div>
          </div>
        </Button>
      </div>
    </>
  );
}
