"use client";

import React, { useState } from "react";
import OverlayLayout from "../layouts/OverlayLayout";
import { selectDefaultAttributes } from "@/lib/misc";
import { LocalLink } from "@/components/util/LocalizedNavigation";
import ProductAttributes from "../forms/AttributesForm";
import { useQuery } from "@tanstack/react-query";
import { ICustomeProductAttribute, IFullProduct } from "@/types";
import Button from "../ui/Button";
import { useTranslation } from "@/context/Translation";
import useAddToCart from "@/features/add-to-cart/useAddToCart";
import LoadingSpinner from "../LoadingUi/LoadingSpinner";
import { getProductDetails } from "@/services/catalog.service";
import { useProductStore } from "@/stores/productStore";
import ProductReviews from "../product/Reviews";
import ProductCarosel from "../product/ProductCarosel";
import { SINGLE_PRODUCT_QUERY_KEY } from "@/constants/query-keys";

export default function ProductMoreInfoOverlay() {
  const setIsProductMoreInfoOpen = useProductStore((state) => state.setIsProductMoreInfoOpen);
  const productId = useProductStore((state) => state.productIdToOverlay);

  const productQuery = useQuery({
    queryKey: [SINGLE_PRODUCT_QUERY_KEY, productId],
    queryFn: () => getProductDetails(productId ?? ""),
    enabled: !!productId
  });
  const product = productQuery.data;

  return (
    <OverlayLayout className="relative" close={() => setIsProductMoreInfoOpen(false)}>
      {product ? <MainLogic product={product} /> : <LoadingSpinner />}
    </OverlayLayout>
  );
}

function MainLogic({ product }: { product: IFullProduct }) {
  const { t } = useTranslation();
  const [activeTap, setActiveTap] = useState<"description" | "reviews">("description");
  const [quantity, setQuantity] = useState(1);
  const [customAttributes, setCustomAttributes] = useState<ICustomeProductAttribute[]>(() =>
    selectDefaultAttributes(product.productAttributes)
  );
  const [cart, setCart] = useState(() => ({
    state: product.isInCart,
    count: product.carts
  }));

  const { handleAddToCart, isPending } = useAddToCart({
    product: { _id: product._id, seName: product.seName, carts: product.carts },
    onSuccess: (shouldAdd) => {
      setCart({ count: cart.count + (shouldAdd ? 1 : -1), state: shouldAdd });
    }
  });

  const addToCartClickHandle = () => handleAddToCart(!cart.state, quantity, customAttributes);
  const reviews = product.productReviews ?? [];

  const setCartValues = (attr: ICustomeProductAttribute[], quantity: number) => {
    setCustomAttributes(attr);
    setQuantity(quantity);
  };

  return (
    <>
      <ProductCarosel height={400} images={product.pictures} productName={product.name} />
      <h1 className="text-2xl font-bold">{product?.name}</h1>
      <LocalLink
        className="text-base text-gray-400 hover:text-primary hover:underline"
        href={`/vendor/${product?.vendor.seName}`}
      >
        {t("soldBy")}: {product?.vendor.name}
      </LocalLink>
      <div className="mb-2 text-lg font-bold">{product?.price.price}$</div>
      <div className="mb-4 text-center text-sm text-gray-400">
        {product?.productTags
          ? product?.productTags.map((tag) => (
              <LocalLink className="me-4 hover:underline" dir="ltr" href={`/tag/${tag.seName}`} key={tag._id}>
                #{tag.name}
              </LocalLink>
            ))
          : null}
      </div>
      {product && product.productAttributes.length > 0 ? (
        <div className="mb-4">
          <ProductAttributes
            customAttributes={customAttributes}
            productAttributes={product.productAttributes}
            onChange={(attr, quantity) => setCartValues(attr, quantity)}
          />
        </div>
      ) : null}
      <Button className="w-full bg-primary text-white" isLoading={isPending} onClick={addToCartClickHandle}>
        {cart.state ? t("removeFromCart") : t("addToCart")}
      </Button>
      <ul className="sticky -top-4 z-20 flex w-full items-center border-b bg-white">
        <li className={`w-full ${activeTap === "description" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}>
          <a className="flex justify-center py-2" role="button" onClick={() => setActiveTap("description")}>
            {t("description")}
          </a>
        </li>
        <li className={`w-full ${activeTap === "reviews" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}>
          <a className="flex justify-center py-2" role="button" onClick={() => setActiveTap("reviews")}>
            {t("reviews")}
          </a>
        </li>
      </ul>
      <div className="mt-4 px-2 pb-20">
        {activeTap === "description" ? <p>{product.fullDescription}</p> : null}

        {activeTap === "reviews" ? (
          reviews.length ? (
            <ProductReviews reviews={reviews} />
          ) : (
            <div className="py-4 text-center text-gray-400">No Reviews Avilable</div>
          )
        ) : null}
      </div>
    </>
  );
}
