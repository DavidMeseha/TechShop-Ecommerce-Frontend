import { IOrder } from "@/types";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import React from "react";

type Props = {
  order: IOrder;
};

export default function OrderItem({ order }: Props) {
  return (
    <li className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex grow flex-col justify-between">
        <LocalLink className="text-lg font-bold" href={`/user/order-details/${order._id}`}>
          #{order._id}
        </LocalLink>
        <p className="max-w-[250px] overflow-clip text-ellipsis text-nowrap text-xs text-gray-400">
          {order.items.map((item) => item.product.name + ", ")}
        </p>
      </div>
      <div className="w-[50px] text-xs text-gray-400">{order.shippingStatus}</div>
    </li>
  );
}
