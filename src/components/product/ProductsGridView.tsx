import React, { useCallback } from "react";
import ProductCard from "@/components/product/Card";
import { IFullProduct } from "@/types";
import { useUserStore } from "@/stores/userStore";

type Props = {
  products: IFullProduct[];
};

export default function ProductsGridView({ products }: Props) {
  const cartItems = useUserStore((state) => state.cartItems);
  const saves = useUserStore((state) => state.saves);
  const likes = useUserStore((state) => state.likes);

  const isInCart = useCallback((id: string) => !!cartItems.find((item) => item.product === id), [cartItems]);

  return (
    <div className="relative mt-4 grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products.map((product) => (
        <ProductCard
          isInCart={isInCart(product._id)}
          isLiked={likes.includes(product._id)}
          isSaved={saves.includes(product._id)}
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
}
