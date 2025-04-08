"use client";

import React from "react";
import { IFullProduct } from "../../types";
import ProductVendorButton from "./VendorButton";
import LikeProductButton from "./LikeButton";
import RateProductButton from "./RateButton";
import SaveProductButton from "./SaveButton";
import AddToCartButton from "./AddToCartButton";
import ViewMoreButton from "../ui/ViewMoreButton";
import ProductCarosel from "./ProductCarosel";

type Props = {
  product: IFullProduct;
  isFollowed: boolean;
};

export default React.memo(
  function ProductSectionMobile({ product, isFollowed }: Props) {
    return (
      <>
        <div className="relative h-screen w-full snap-start bg-black" id={product._id}>
          <div className="relative flex h-[calc(100dvh-58px)] items-center">
            <ProductCarosel images={product.pictures} productName={product.name} />

            <div className="absolute bottom-1 end-0">
              <div className="relative bottom-0 end-0 flex flex-col items-center gap-2 p-4">
                <ViewMoreButton product={product} />
                <ProductVendorButton isFollowed={isFollowed} vendor={product.vendor} />
                <LikeProductButton isLiked={product.isLiked} likesCount={product.likes} productId={product._id} />
                <RateProductButton isRated={product.isReviewed} product={product} />
                <SaveProductButton isSaved={product.isSaved} productId={product._id} savesCount={product.saves} />
                <AddToCartButton isInCart={product.isInCart} product={product} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.isSaved === nextProps.product.isSaved &&
      prevProps.product.isInCart === nextProps.product.isInCart &&
      prevProps.product.isLiked === nextProps.product.isLiked &&
      prevProps.product.isReviewed === nextProps.product.isReviewed &&
      prevProps.product._id === nextProps.product._id
    );
  }
);
