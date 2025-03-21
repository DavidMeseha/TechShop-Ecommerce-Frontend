"use client";

import React, { useState } from "react";
import OverlayLayout from "../layouts/OverlayLayout";
import { IProductAttribute } from "@/types";
import { selectDefaultAttributes } from "@/lib/misc";
import ProductAttributes from "../product/Attributes";
import { useQuery } from "@tanstack/react-query";
import Button from "../ui/Button";
import AttributesOverlayLoading from "../LoadingUi/AttributesOverlayLoading";
import { getProductAttributes } from "@/services/products.service";
import { useProductStore } from "@/stores/productStore";
import useAddToCart, { IAddToCartProduct } from "@/hooks/useAddToCart";
import { useTranslation } from "@/context/Translation";

export default function AttributesOverlay() {
  const { setIsProductAttributesOpen, productIdToOverlay } = useProductStore();

  const productQuery = useQuery({
    queryKey: ["productAttributes", productIdToOverlay],
    queryFn: () => getProductAttributes(productIdToOverlay ?? "0"),
    enabled: !!productIdToOverlay
  });
  const product = productQuery.data;

  return (
    <OverlayLayout close={() => setIsProductAttributesOpen(false)} title={product?.name}>
      {productQuery.isPending || !product ? <AttributesOverlayLoading /> : <MainLogic product={product} />}
    </OverlayLayout>
  );
}

function MainLogic({ product }: { product: IAddToCartProduct }) {
  const setIsProductAttributesOpen = useProductStore((state) => state.setIsProductAttributesOpen);
  const { t } = useTranslation();
  const [customAttributes, setCustomAttributes] = useState<IProductAttribute[]>(() =>
    selectDefaultAttributes(product.productAttributes)
  );

  const { handleAddToCart, isPending } = useAddToCart({
    product: product,
    onSuccess: () => setIsProductAttributesOpen(false)
  });

  const handleAttributesChange = (attributeId: string, value: string[]) => {
    let tempAttributes = [...customAttributes];
    const index = tempAttributes.findIndex((attr) => attr._id === attributeId);

    const originalAttribute = product.productAttributes.find((attr) => attr._id === attributeId) as IProductAttribute;
    const selectedValues = originalAttribute.values.filter((val) => value.includes(val._id)) as IProductAttribute[];

    tempAttributes[index] = { ...originalAttribute, values: selectedValues };

    setCustomAttributes(tempAttributes);
  };
  return (
    <>
      <ProductAttributes
        customAttributes={customAttributes}
        handleChange={handleAttributesChange}
        productAttributes={product.productAttributes}
      />
      <Button
        className="mt-4 w-full bg-primary text-center text-white"
        isLoading={isPending}
        onClick={() => handleAddToCart(true, customAttributes)}
      >
        {t("addToCart")}
      </Button>
    </>
  );
}
