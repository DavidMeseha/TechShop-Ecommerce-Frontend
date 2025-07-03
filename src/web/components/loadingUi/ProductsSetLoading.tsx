import React from "react";
import ProductCardLoading from "./ProductCardLoading";

export default function ProductsSetLoading({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardLoading key={index} />
      ))}
    </>
  );
}
