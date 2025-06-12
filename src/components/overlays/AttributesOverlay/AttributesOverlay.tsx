"use client";

import React, { useState } from "react";
import OverlayLayout from "../../layouts/OverlayLayout";
import { ICustomeProductAttribute } from "@/types";
import { selectDefaultAttributes } from "@/lib/misc";
import ProductAttributes from "../../forms/AttributesForm";
import { useQuery } from "@tanstack/react-query";
import Button from "../../ui/Button";
import AttributesOverlayLoading from "./AttributesOverlayLoading";
import { getProductAttributes } from "@/services/catalog.service";
import { useProductStore } from "@/stores/productStore";
import { IAddToCartProduct } from "@/features/add-to-cart/useAddToCart";
import { useTranslation } from "@/context/Translation";
import { PRODUCT_ATTRIBUTES_QUERY_KEY } from "@/constants/query-keys";

export default function AttributesOverlay() {
  const { setIsProductAttributesOpen, productIdToOverlay, action } = useProductStore();

  const productQuery = useQuery({
    queryKey: [PRODUCT_ATTRIBUTES_QUERY_KEY, productIdToOverlay],
    queryFn: () => getProductAttributes(productIdToOverlay),
    enabled: !!productIdToOverlay
  });
  const product = productQuery.data;

  const handleSubmit = (customAttributes: ICustomeProductAttribute[], quantity: number) => {
    if (action) {
      action(customAttributes, quantity);
      setIsProductAttributesOpen(false);
    }
  };

  return (
    <OverlayLayout close={() => setIsProductAttributesOpen(false)} title={product?.name}>
      {productQuery.isPending || !product ? (
        <AttributesOverlayLoading />
      ) : (
        <MainLogic action={handleSubmit} product={product} />
      )}
    </OverlayLayout>
  );
}

function MainLogic({
  product,
  action
}: {
  product: IAddToCartProduct;
  action: (attr: ICustomeProductAttribute[], quantity: number) => void;
}) {
  const { t } = useTranslation();
  const [quantity, setQuentity] = useState(1);
  const [customAttributes, setCustomAttributes] = useState<ICustomeProductAttribute[]>(() =>
    selectDefaultAttributes(product.productAttributes)
  );

  const setValues = (attr: ICustomeProductAttribute[], q: number) => {
    setCustomAttributes(attr);
    setQuentity(q);
  };

  return (
    <>
      <ProductAttributes
        customAttributes={customAttributes}
        productAttributes={product.productAttributes}
        onChange={(attr, quantity) => setValues(attr, quantity)}
      />

      <Button
        className="mt-4 w-full bg-primary text-center text-white"
        onClick={() => action(customAttributes, quantity)}
      >
        {t("addToCart")}
      </Button>
    </>
  );
}
