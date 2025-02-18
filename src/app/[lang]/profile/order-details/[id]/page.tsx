"use client";

import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import { IFullProduct, IProductAttribute } from "@/types";
import Image from "next/image";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { getOrder } from "@/services/user.service";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();

  const orderQuery = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => getOrder(params.id)
  });
  const order = orderQuery.data;

  return (
    <>
      <div className="p-4">
        <div className="relative mt-4 rounded-md border p-4">
          <div className="absolute -top-2 bg-white px-4 text-xs font-normal text-secondary">{order?._id}</div>
          <ul>
            {!orderQuery.isFetching ? (
              order && order.items.map((item) => <ProductListItem item={item} key={item.product.seName} />)
            ) : (
              <>
                <ProductListItemLoading />
                <ProductListItemLoading />
                <ProductListItemLoading />
              </>
            )}
          </ul>
        </div>

        <div className="mt-4 flex w-full flex-col-reverse gap-4 rounded-md border p-4 md:flex-row md:gap-10">
          <div className="grow">
            <div className="mb-2 text-lg font-bold">Order Statuses</div>
            <div className="grid grid-cols-2 p-2">
              <div>{t("orderDetails.billing")}:</div> <div className="text-end">{order?.billingStatus}</div>
            </div>
            <div className="grid grid-cols-2 p-2">
              <div>{t("orderDetails.shipping")}:</div> <div className="text-end">{order?.shippingStatus}</div>
            </div>
          </div>
          <div className="grow">
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
              <div className="text-end">{order?.billingStatus === "cod" ? 10 : 0}$</div>
            </div>

            <div className="grid grow grid-cols-2 border-t-2 border-black p-2">
              <div>{t("total")}</div>
              <div className="text-end">{order?.totalValue ?? 0 + (order?.billingStatus === "cod" ? 10 : 0)}$</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductListItemLoading() {
  return (
    <SkeletonTheme baseColor="#d5d5d5" highlightColor="#ececec">
      <li className="flex items-center justify-between py-2">
        <div className="flex w-full items-center gap-3">
          <Skeleton height={56} width={56} />
          <div>
            <Skeleton height={25} width={190} />
            <Skeleton width={60} />
          </div>
          <Skeleton height={30} width={30} />
        </div>
        <Skeleton height={30} width={80} />
      </li>
    </SkeletonTheme>
  );
}

function ProductListItem({
  item
}: {
  item: { product: IFullProduct; quantity: number; attributes: IProductAttribute[] };
}) {
  return (
    <li className="flex items-center justify-between py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={item.product.name}
          className="h-14 w-14 rounded-md bg-lightGray object-contain"
          height={66}
          src={item.product.pictures[0].imageUrl ?? "/images/placeholder-user.jpg"}
          width={66}
        />
        <div>
          <p className="font-bold">{item.product.name}</p>
          <p className="text-secondary">{item.product.price.price}$</p>
        </div>
        <span className="font-normal text-secondary"> X{item.quantity}</span>
      </div>
      <p>{item.product.price.price * item.quantity}$</p>
    </li>
  );
}
