import { IFullProduct } from "@/types";
import React from "react";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/context/Translation";
import ProductPictureCarosel from "../product/ProductPictureCarosel";
import ProductCardActions from "./ProductCardActions";
import ProductCardBasicDetails from "./ProductCardBasicDetails";
import Tag from "../ui/Tag";

type Props = {
  product: IFullProduct;
  canAddReview: boolean;
  minWidth?: number | "auto";
  className?: string;
};

function ProductCard({ product, canAddReview, minWidth = "auto", className }: Props) {
  const { t } = useTranslation();

  return (
    <div
      style={{ minWidth: minWidth }}
      className={cn(
        "relative flex w-full flex-col justify-between overflow-hidden rounded-sm border bg-white",
        className
      )}
    >
      {product.inStock ? null : <Tag>{t("noStock")}</Tag>}

      <div>
        <ProductPictureCarosel height={200} images={product.pictures} productName={product.name} />
        <ProductCardBasicDetails
          _id={product._id}
          canAddReview={canAddReview}
          name={product.name}
          price={product.price}
          productReviewOverview={product.productReviewOverview}
          seName={product.seName}
          vendor={product.vendor}
        />
      </div>

      <ProductCardActions
        _id={product._id}
        carts={product.carts}
        isInCart={product.isInCart}
        isLiked={product.isLiked}
        isSaved={product.isSaved}
        likes={product.likes}
        saves={product.saves}
        seName={product.seName}
      />
    </div>
  );
}

export default React.memo(ProductCard, (prevProps, nextProps) => {
  return (
    prevProps.product._id === nextProps.product._id &&
    nextProps.product.isInCart === prevProps.product.isInCart &&
    nextProps.product.isLiked === prevProps.product.isLiked &&
    nextProps.product.isSaved === prevProps.product.isSaved
  );
});
