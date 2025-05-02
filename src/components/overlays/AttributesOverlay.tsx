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
import { IAddToCartProduct } from "@/hooks/useAddToCart";
import { useTranslation } from "@/context/Translation";
import { PRODUCT_ATTRIBUTES_QUERY_KEY } from "@/constants/query-keys";

export default function AttributesOverlay() {
  const { setIsProductAttributesOpen, productIdToOverlay, action } = useProductStore();

  const productQuery = useQuery({
    queryKey: [PRODUCT_ATTRIBUTES_QUERY_KEY, productIdToOverlay],
    queryFn: () => getProductAttributes(productIdToOverlay ?? "0"),
    enabled: !!productIdToOverlay
  });
  const product = productQuery.data;

  const handleSubmit = (customAttributes: IProductAttribute[]) => {
    if (action) {
      action(customAttributes);
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

function MainLogic({ product, action }: { product: IAddToCartProduct; action: (attr: IProductAttribute[]) => void }) {
  const { t } = useTranslation();
  const [customAttributes, setCustomAttributes] = useState<IProductAttribute[]>(() =>
    selectDefaultAttributes(product.productAttributes)
  );

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
      <Button className="mt-4 w-full bg-primary text-center text-white" onClick={() => action(customAttributes)}>
        {t("addToCart")}
      </Button>
    </>
  );
}
