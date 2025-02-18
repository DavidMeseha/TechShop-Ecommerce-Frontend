"use client";

import React, { useEffect, useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useAppStore } from "@/stores/appStore";
import { IProductAttribute } from "@/types";
import { selectDefaultAttributes } from "@/lib/misc";
import ProductAttributes from "../product/Attributes";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Button from "../ui/Button";
import AttributesOverlayLoading from "../LoadingUi/AttributesOverlayLoading";

export default function AttributesOverlay() {
  const { setIsProductAttributesOpen, overlayProductId, action } = useAppStore();
  const [customAttributes, setCustomAttributes] = useState<IProductAttribute[]>([]);

  const productQuery = useQuery({
    queryKey: ["productAttributes", overlayProductId],
    queryFn: () =>
      axios
        .get<{
          _id: string;
          productAttributes: IProductAttribute[];
          name: string;
        }>(`/api/product/attributes/${overlayProductId}`)
        .then((res) => {
          return res.data;
        })
  });
  const product = productQuery.data;

  useEffect(() => {
    product && setCustomAttributes(selectDefaultAttributes(product.productAttributes));
  }, [productQuery.data]);

  const handleAttributesChange = (attributeId: string, value: string[]) => {
    if (!product) return;
    let tempAttributes = [...customAttributes];
    const index = tempAttributes.findIndex((attr) => attr._id === attributeId);

    const originalAttribute = product.productAttributes.find((attr) => attr._id === attributeId) as IProductAttribute;
    const selectedValues = originalAttribute.values.filter((val) => value.includes(val._id)) as IProductAttribute[];

    tempAttributes[index] = { ...originalAttribute, values: selectedValues };

    setCustomAttributes(tempAttributes);
  };

  return (
    <OverlayLayout close={() => setIsProductAttributesOpen(false)} title={product?.name}>
      {productQuery.isFetching ? (
        <AttributesOverlayLoading />
      ) : product ? (
        <>
          <ProductAttributes
            customAttributes={customAttributes}
            handleChange={handleAttributesChange}
            productAttributes={product.productAttributes}
          />
          <Button
            className="mt-4 w-full bg-primary text-center text-white"
            onClick={() => {
              action.fn && action.fn(customAttributes);
              setIsProductAttributesOpen(false);
            }}
          >
            {action.name || "Submit"}
          </Button>
        </>
      ) : null}
    </OverlayLayout>
  );
}
