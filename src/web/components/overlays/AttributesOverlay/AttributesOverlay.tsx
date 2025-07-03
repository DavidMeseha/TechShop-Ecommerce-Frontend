"use client";

import React, { useState } from "react";
import OverlayLayout from "@/common/layouts/OverlayLayout";
import { ICustomeProductAttribute } from "@/types";
import { selectDefaultAttributes } from "@/common/lib/utils";
import ProductAttributes from "../../forms/AttributesForm";
import { useQuery } from "@tanstack/react-query";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import AttributesOverlayLoading from "./AttributesOverlayLoading";
import { getProductAttributes } from "@/web/services/catalog.service";
import { useProductStore } from "@/web/stores/productStore";
import { IAddToCartProduct } from "@/web/features/add-to-cart/useAddToCart";
import { useTranslation } from "@/common/context/Translation";
import { PRODUCT_ATTRIBUTES_QUERY_KEY } from "@/common/constants/query-keys";

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

      <SubmitButton
        className="mt-4 w-full bg-primary text-center text-white"
        onClick={() => action(customAttributes, quantity)}
      >
        {t("addToCart")}
      </SubmitButton>
    </>
  );
}
