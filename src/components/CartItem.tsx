"use client";

import React, { useRef, useState } from "react";
import useClickRecognition from "@/hooks/useClickRecognition";
import { useUserStore } from "@/stores/userStore";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BiLoaderCircle } from "react-icons/bi";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import { IFullProduct, IProductAttribute } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./layout/MainLayout";
import { removeFromCart } from "@/services/userActions.service";

type Props = {
  product: IFullProduct;
  canEdit?: boolean;
  attributes: IProductAttribute[];
  quantity: number;
};

export default function CartItem({ product, attributes, quantity, canEdit = false }: Props) {
  const { setCartItems } = useUserStore();
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product._id],
    mutationFn: () => removeFromCart(product._id),
    onSuccess: () => {
      setCartItems();
      queryClient.fetchQuery({ queryKey: ["cartItems"] });
    }
  });

  useClickRecognition({ onOutsideClick: () => setShowDetails(false), containerRef });

  return (
    <li className="list-none border-b px-4" ref={containerRef}>
      <div className="flex items-center justify-between py-2">
        <div className="flex w-full items-center gap-3">
          <Image
            alt={product.name}
            className="h-14 w-14 rounded-md object-contain"
            height={66}
            src={product.pictures[0].imageUrl}
            width={66}
          />
          <div>
            <p className="font-bold">{product.name}</p>
            <p className="text-sm text-secondary">
              {product.price.price}$ . quantity: {quantity}
            </p>
          </div>
        </div>
        <button className="relative" onClick={() => setShowDetails(!showDetails)}>
          {canEdit ? <RiArrowDropDownLine size={35} /> : <div>{quantity * product.price.price}$</div>}
        </button>
      </div>
      {canEdit ? (
        <div
          className={`px-1 transition-all ${showDetails ? "max-h-[300vh] overflow-auto" : "max-h-0 overflow-hidden"}`}
        >
          {attributes.map((attribute) => (
            <div className="mb-2" key={attribute._id}>
              {attribute.name}: {attribute.values.map((value) => value.name + ", ")}
            </div>
          ))}

          <div className="mb-4 flex justify-end">
            <button className="rounded-md bg-lightGray px-4 py-2" onClick={() => removeFromCartMutation.mutate()}>
              {removeFromCartMutation.isPending ? (
                <BiLoaderCircle className="animate-spin" color="#000" size={25} />
              ) : (
                t("remove")
              )}
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}
