"use client";

import { useTranslation } from "@/common/context/Translation";
import { CheckoutForm } from "@/web/schemas/valdation";
import { placeOrder, preperCardPayment } from "@/web/services/checkout.service";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "@bprogress/next";
import { useRouter } from "@bprogress/next";
import { useState } from "react";
import { toast } from "react-toastify";
import { ORDERS_QUERY_KEY } from "@/common/constants/query-keys";

export default function usePlaceOrder() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const placeOrderMutation = useMutation({
    mutationKey: ["placeOrder"],
    mutationFn: (form: CheckoutForm & { paymentId?: string }) => placeOrder(form),
    onSuccess: (res) => router.push(`/user/order-success/${res.data._id}`),
    onError: () => {
      toast.error("Could not place order");
      setIsProcessing(false);
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ORDERS_QUERY_KEY) });
    }
  });

  const preperPaymentMutation = useMutation({
    mutationKey: ["preperPayment"],
    mutationFn: () => preperCardPayment()
  });

  const submit = async (form: CheckoutForm) => {
    const process = async () => {
      if (form.billingMethod === "cod") return placeOrderMutation.mutate(form);

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
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(paymentSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (stripeError || !paymentIntent) {
        setIsProcessing(false);
        toast.error(stripeError.message);
        return toast.error(t("checkout.failedToVerifyPayment"));
      } else placeOrderMutation.mutate({ ...form, paymentId: paymentIntent.id });
    };

    setIsProcessing(true);
    process();
  };

  return {
    isProcessing: isProcessing || placeOrderMutation.isPending,
    submit
  };
}
