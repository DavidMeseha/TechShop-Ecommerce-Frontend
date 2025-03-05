"use client";

import { useTranslation } from "@/context/Translation";
import { CheckoutForm } from "@/schemas/valdation";
import { placeOrder, preperCardPayment } from "@/services/checkout.service";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { toast } from "react-toastify";

export default function usePlaceOrder() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const placeOrderMutation = useMutation({
    mutationKey: ["placeOrder"],
    mutationFn: (form: CheckoutForm) => placeOrder(form),
    onSuccess: (res) => router.push(`/user/order-success/${res.data._id}`),
    onError: () => {
      toast.error("Could not place order");
      setIsProcessing(false);
    }
  });

  const preperPaymentMutation = useMutation({
    mutationKey: ["preperPayment"],
    mutationFn: () => preperCardPayment()
  });

  const submit = async (form: CheckoutForm) => {
    const process = async () => {
      if (form.billingMethod === "cod") {
        return placeOrderMutation.mutate(form);
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
        toast.error(stripeError.message);
        return toast.error(t("checkout.failedToVerifyPayment"));
      } else placeOrderMutation.mutate(form);
    };

    setIsProcessing(true);
    process();
  };

  return {
    isProcessing: isProcessing || placeOrderMutation.isPending,
    submit
  };
}
