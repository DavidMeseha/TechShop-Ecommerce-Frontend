import { IFullProduct, IProductAttribute } from "@/types";
import Image from "next/image";
import React from "react";

type Props = {
  item: {
    product: IFullProduct;
    quantity: number;
    attributes: IProductAttribute[];
  };
};

export default function OrderProductItem({ item }: Props) {
  return (
    <li className="flex items-center justify-between py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={item.product.name}
          className="bg-lightGray h-14 w-14 rounded-md object-contain"
          height={66}
          src={item.product.pictures[0].imageUrl ?? "/images/placeholder-user.jpg"}
          width={66}
        />
        <div>
          <p className="font-bold">{item.product.name}</p>
          <p className="text-gray-400">{item.product.price.price}$</p>
        </div>
        <span className="font-normal text-gray-400"> X{item.quantity}</span>
      </div>
      <p>{item.product.price.price * item.quantity}$</p>
    </li>
  );
}
