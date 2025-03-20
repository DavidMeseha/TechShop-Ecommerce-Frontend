import React from "react";
import ProductCard from "@/components/product/ProductCard";
import { IFullProduct } from "@/types";
import ProductsSetLoading from "../LoadingUi/ProductsSetLoading";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";

type Props = {
  products: IFullProduct[];
  isLoading?: boolean;
  limit?: number;
  className?: string;
};

export default function ProductsGridView({ products, isLoading, limit = 4, className = "" }: Props) {
  const user = useUserStore((state) => state.user);
  const classes = cn(
    "relative grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    className
  );

  return (
    <div className={classes}>
      {products.map((product) => (
        <ProductCard canAddReview={!!user?.isRegistered} key={product._id} product={product} />
      ))}
      {isLoading ? <ProductsSetLoading count={limit} /> : null}
    </div>
  );
}
