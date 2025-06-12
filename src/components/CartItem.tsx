"use client";

import React, { useRef, useState } from "react";
import useClickRecognition from "@/hooks/useClickRecognition";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BiLoaderCircle } from "react-icons/bi";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import { IFullProduct, IProductAttribute } from "@/types";
import { cn } from "@/lib/cn";
import useAddToCart from "@/features/add-to-cart/useAddToCart";

type Props = {
  product: IFullProduct;
  canEdit?: boolean;
  attributes: IProductAttribute[];
  quantity: number;
  className?: string;
};

export default React.memo(
  function CartItem({ product, attributes, quantity, canEdit = false, className = "" }: Props) {
    const { t } = useTranslation();
    const [showDetails, setShowDetails] = useState(false);
    const [isInCart, setIsInCart] = useState(product.isInCart);
    const containerRef = useRef(null);

    const { handleAddToCart, isPending } = useAddToCart({
      product,
      onSuccess: () => setIsInCart(false)
    });

    useClickRecognition({ onOutsideClick: () => setShowDetails(false), containerRef });

    return (
      <li
        ref={containerRef}
        className={cn(
          `${!isInCart && canEdit && "pointer-events-none opacity-50"} my-2 list-none rounded-md border px-4`,
          className
        )}
      >
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
              <p className="text-sm text-gray-400">
                {product.price.price}$ . quantity: {quantity}
              </p>
            </div>
          </div>
          <button className="relative" onClick={() => setShowDetails(!showDetails)}>
            {canEdit ? <RiArrowDropDownLine size={35} /> : <div>{quantity * product.price.price}$</div>}
          </button>
        </div>

        {canEdit ? (
          <div className={`overflow-hidden px-1 transition-all ${showDetails ? "max-h-[700px]" : "max-h-0"}`}>
            {attributes.map((attribute) => (
              <div className="mb-2" key={attribute._id}>
                {attribute.name}: {attribute.values.map((value) => value.name + ", ")}
              </div>
            ))}

            <div className="mb-4 flex justify-end">
              <button className="rounded-md bg-gray-200 px-4 py-2" onClick={() => handleAddToCart(false)}>
                {isPending ? <BiLoaderCircle className="animate-spin" color="#000" size={25} /> : t("remove")}
              </button>
            </div>
          </div>
        ) : null}
      </li>
    );
  },
  (prev, next) => prev.product.isInCart === next.product.isInCart && prev.product._id === next.product._id
);
