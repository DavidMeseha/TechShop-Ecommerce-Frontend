"use client";

import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ORDERS_QUERY_KEY } from "@/common/constants/query-keys";
import { getOrder } from "@/web/services/user.service";
import { useTranslation } from "@/common/context/Translation";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";
import OrderProductItem from "./components/OrderProductItem";

export default function OrderDetailsPage({ orderId }: { orderId: string }) {
  const { t } = useTranslation();

  const orderQuery = useQuery({
    queryKey: [ORDERS_QUERY_KEY, orderId],
    queryFn: () => getOrder(orderId)
  });

  const order = orderQuery.data;

  if (orderQuery.isPending) return <LoadingSpinner />;
  if (!order) return notFound();

  return (
    <>
      <div className="p-4">
        <div className="relative mt-4 rounded-md border p-4">
          <div className="absolute -top-2 bg-white px-4 text-xs font-normal text-gray-400">{order?._id}</div>
          <ul>
            {order.items.map((item) => (
              <OrderProductItem item={item} key={item.product.seName} />
            ))}
          </ul>
        </div>

        <div className="mt-4 flex w-full flex-col-reverse gap-2 md:flex-row md:gap-10">
          <div className="grow rounded-md border p-4">
            <div className="mb-2 text-lg font-bold">{t("orderDetails.statuses")}</div>
            <div className="grid grid-cols-2 p-2">
              <div>{t("orderDetails.billing")}:</div> <div className="text-end">{order?.billingStatus}</div>
            </div>
            <div className="grid grid-cols-2 p-2">
              <div>{t("orderDetails.shipping")}:</div> <div className="text-end">{order?.shippingStatus}</div>
            </div>
          </div>
          <div className="grow rounded-md border p-4">
            <div className="mb-2 text-lg font-bold">{t("orderDetails.payment")}</div>
            <div className="grid grow grid-cols-2 p-2">
              <div>{t("orderDetails.subtotal")}</div>
              <div className="text-end">{order?.subTotal}$</div>
            </div>

            <div className="grid grow grid-cols-2 border-t-2 p-2">
              <div>{t("orderDetails.shippingFees")}</div>
              <div className="text-end">{order?.shippingFees}$</div>
            </div>

            <div className="grid grow grid-cols-2 border-t-2 p-2">
              <div>{t("orderDetails.codFees")}</div>
              <div className="text-end">{order.codFees}$</div>
            </div>

            <div className="grid grow grid-cols-2 border-t-2 border-black p-2">
              <div>{t("total")}</div>
              <div className="text-end">{order?.totalValue}$</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
