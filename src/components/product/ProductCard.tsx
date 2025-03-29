import { IFullProduct } from "@/types";
import React from "react";
import { LocalLink } from "../LocalizedNavigation";
import { RiBookmark2Line, RiHeart2Line, RiShoppingCartLine } from "react-icons/ri";
import Button from "../ui/Button";
import useLike from "@/hooks/useLike";
import RatingStars from "../ui/RatingStars";
import useSave from "@/hooks/useSave";
import useAddToCart from "@/hooks/useAddToCart";
import { useProductStore } from "@/stores/productStore";
import ProductCarosel from "./ProductCarosel";
import { cn } from "@/lib/utils";

type Props = {
  product: IFullProduct;
  canAddReview: boolean;
  minWidth?: number | "auto";
  className?: string;
};

function ProductCard({ product, canAddReview, minWidth = "auto", className }: Props) {
  const setIsAddReviewOpen = useProductStore((state) => state.setIsAddReviewOpen);

  const likeHandler = useLike({ productId: product._id, likesCount: product.likes });
  const saveHandler = useSave({ productId: product._id, savesCount: product.saves });
  const addToCartHandler = useAddToCart({ product });

  const rate = product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews;

  return (
    <div
      className={cn("flex w-full flex-col justify-between overflow-hidden rounded-sm border bg-white", className)}
      style={{ minWidth: minWidth }}
    >
      <div>
        <ProductCarosel height={200} images={product.pictures} productName={product.name} />

        {/* Product Info */}
        <div className="mt-2 flex flex-col gap-1 px-2 sm:px-4">
          <LocalLink className="font-semibold text-gray-800 hover:underline" href={`/product/${product.seName}`}>
            <span title={product.name}>{product.name}</span>
          </LocalLink>
          {product.vendor.name ? (
            <p className="-mt-1 text-sm text-gray-400">
              sold by:{" "}
              <LocalLink className="hover:text-primary" href={`/vendor/${product.vendor.seName}`}>
                {product.vendor.name}
              </LocalLink>
            </p>
          ) : null}
          <span className="font-semibold text-gray-800">{product.price.price}$</span>
          <div className="flex items-center">
            <RatingStars rate={rate} size={15} />
            {canAddReview ? (
              <button
                aria-label="Add review"
                className="px-2 text-lg text-primary"
                onClick={() => setIsAddReviewOpen(true, product._id)}
              >
                <div className="lh-0 h-2">+</div>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Product Actions */}
      <div className="mt-4 flex border-t border-gray-200">
        <Button
          aria-label="Add to cart"
          className={`basis-1/3 rounded-none border-e fill-black p-1 ${product.isInCart ? "bg-green-200" : "bg-white"}`}
          isLoading={addToCartHandler.isPending}
          spinnerSize="20"
          onClick={() => addToCartHandler.handleAddToCart(!product.isInCart)}
        >
          <div className="flex items-center justify-center gap-1">
            <RiShoppingCartLine size={20} />
            <span className="hidden text-sm sm:inline">{product.carts}</span>
          </div>
        </Button>
        <Button
          aria-label="like product"
          className={`basis-1/3 rounded-none border-e fill-black p-1 ${product.isLiked ? "bg-red-200" : "bg-white"}`}
          spinnerSize="20"
          onClick={() => likeHandler(!product.isLiked)}
        >
          <div className="flex items-center justify-center gap-1">
            <RiHeart2Line size={20} />
            <span className="hidden text-sm sm:inline">{product.likes}</span>
          </div>
        </Button>
        <Button
          aria-label="save product"
          className={`basis-1/3 rounded-none fill-black p-1 ${product.isSaved ? "bg-yellow-200" : "bg-white"}`}
          spinnerSize="20"
          onClick={() => saveHandler(!product.isSaved)}
        >
          <div className="flex items-center justify-center gap-1">
            <RiBookmark2Line size={20} />
            <span className="hidden text-sm sm:inline">{product.saves}</span>
          </div>
        </Button>
      </div>
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
