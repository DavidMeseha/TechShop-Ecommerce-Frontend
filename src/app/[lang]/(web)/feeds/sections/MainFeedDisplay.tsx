import { IFullProduct } from "@/types";
import React from "react";
import ProductSection from "../components/Post";

type Props = {
  products: IFullProduct[];
};

export default function MainFeedDisplay({ products }: Props) {
  return (
    <div className="hidden md:block">
      <div className="mt-6">
        {products.map((product) => (
          <ProductSection key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
