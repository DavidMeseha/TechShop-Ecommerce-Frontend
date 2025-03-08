"use client";

import React, { useMemo, useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { selectDefaultAttributes } from "@/lib/misc";
import { useUserStore } from "@/stores/userStore";
import { LocalLink } from "@/components/LocalizedNavigation";
import ProductAttributes from "../product/Attributes";
import { useQuery } from "@tanstack/react-query";
import { IFullProduct, IProductAttribute } from "../../types";
import Button from "../ui/Button";
import { useTranslation } from "@/context/Translation";
import useAddToCart from "@/hooks/useAddToCart";
import LoadingSpinner from "../LoadingUi/LoadingSpinner";
import { getProductDetails } from "@/services/products.service";
import { useProductStore } from "@/stores/productStore";
import Reviews from "../Reviews";
import ProductCarosel from "../product/ProductCarosel";

export default function ProductMoreInfoOverlay() {
  const setIsProductMoreInfoOpen = useProductStore((state) => state.setIsProductMoreInfoOpen);
  const productId = useProductStore((state) => state.productIdToOverlay);

  const productQuery = useQuery({
    queryKey: ["product", productId],
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
  const cartItems = useUserStore((state) => state.cartItems);
  const { t } = useTranslation();
  const [activeTap, setActiveTap] = useState<"description" | "reviews">("description");
  const [customAttributes, setCustomAttributes] = useState<IProductAttribute[]>(() =>
    selectDefaultAttributes(product.productAttributes)
  );

  const inCart = useMemo(() => cartItems.find((item) => item.product === product._id), [cartItems]);

  const { handleAddToCart, isPending } = useAddToCart({ product });

  const handleAttributesChange = (attributeId: string, value: string[]) => {
    if (!product) return;
    let tempAttributes = [...customAttributes];
    const index = tempAttributes.findIndex((attr) => attr._id === attributeId);

    const originalAttribute = product.productAttributes.find((attr) => attr._id === attributeId) as IProductAttribute;
    const selectedValues = originalAttribute.values.filter((val) => value.includes(val._id)) as IProductAttribute[];

    tempAttributes[index] = { ...originalAttribute, values: selectedValues };

    setCustomAttributes(tempAttributes);
  };

  const addToCartClickHandle = () => handleAddToCart(!inCart, customAttributes);
  const reviews = product.productReviews ?? [];

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
            handleChange={handleAttributesChange}
            productAttributes={product.productAttributes}
          />
        </div>
      ) : null}
      <Button className="w-full bg-primary text-white" isLoading={isPending} onClick={addToCartClickHandle}>
        {inCart ? t("removeFromCart") : t("addToCart")}
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
            <Reviews reviews={reviews} />
          ) : (
            <div className="py-4 text-center text-gray-400">No Reviews Avilable</div>
          )
        ) : null}
      </div>
    </>
  );
}
