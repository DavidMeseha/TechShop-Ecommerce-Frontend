import { IOrder } from "@/types";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";

type Props = {
  order: IOrder;
};

export default function OrderItem({ order }: Props) {
  return (
    <li className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex grow flex-col justify-between">
        <LocalLink className="text-lg font-bold" href={`/profile/order-details/${order._id}`}>
          #{order._id}
        </LocalLink>
        <p className="max-w-[250px] overflow-clip text-ellipsis text-nowrap text-xs text-secondary">
          {order.items.map((item) => item.product.name + ", ")}
        </p>
      </div>
      <div className="w-[50px] text-xs text-secondary">{order.shippingStatus}</div>
    </li>
  );
}
