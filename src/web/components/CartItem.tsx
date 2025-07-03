"use client";

import React, { useRef, useState } from "react";
import useClickRecognition from "@/common/hooks/useClickRecognition";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useTranslation } from "@/common/context/Translation";
import Image from "next/image";
import { IFullProduct, IProductAttribute } from "@/types";
import { cn } from "@/common/lib/utils";
import useAddToCart from "@/web/features/add-to-cart/useAddToCart";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";

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
            <div className="mb-4 space-y-2 divide-y divide-gray-100">
              {attributes.map((attribute) => (
                <div className="flex items-center justify-between py-2 text-sm" key={attribute._id}>
                  <span className="font-medium text-gray-700">{attribute.name}</span>
                  <span className="text-gray-600">{attribute.values.map((value) => value.name).join(", ")}</span>
                </div>
              ))}
            </div>

            <div className="mb-4 flex justify-end border-t pt-4">
              <SubmitButton
                className="rounded-md bg-red-50 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                isLoading={isPending}
                onClick={() => handleAddToCart(false)}
              >
                {t("remove")}
              </SubmitButton>
            </div>
          </div>
        ) : null}
      </li>
    );
  },
  (prev, next) => prev.product.isInCart === next.product.isInCart && prev.product._id === next.product._id
);
