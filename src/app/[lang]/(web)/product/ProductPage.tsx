"use client";
import AddToCartButton from "@/features/add-to-cart/AddToCartButton";
import LikeProductButton from "@/features/like-product/LikeButton";
import ProductAttributes from "@/components/forms/AttributesForm";
import RatingStars from "@/components/ui/RatingStars";
import SaveProductButton from "@/features/save-product/SaveButton";
import { selectDefaultAttributes } from "@/lib/misc";
import { ICustomeProductAttribute, IFullProduct } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { getProductUserActions, homeFeedProducts } from "@/services/catalog.service";
import ProductsGridView from "@/components/product/ProductsGridView";
import ProductCarosel from "@/components/product/ProductCarosel";
import { useTranslation } from "@/context/Translation";
import {
  PRODUCT_ACTIONS_QUERY_KEY,
  PRODUCTS_QUERY_KEY,
  SIMILAR_QUERY_KEY,
  SINGLE_PRODUCT_QUERY_KEY
} from "@/constants/query-keys";
import ProductActionsLoading from "@/app/[lang]/(web)/product/components/ProductActionsLoading";
import AddReviewForm from "@/components/forms/AddReviewForm";
import Reviews from "@/components/product/Reviews";

type Props = {
  product: IFullProduct;
};

export default function ProductPage({ product }: Props) {
  const [isReviewed, setIsReviewed] = useState(false);
  const [customAttributes, setCustomAttributes] = useState(selectDefaultAttributes(product.productAttributes));
  const [quantity, setQuantity] = useState(1);
  const [ref, inView] = useInView();
  const { t } = useTranslation();
  const rating = (product.productReviewOverview.ratingSum / (product.productReviewOverview.totalReviews || 1)).toFixed(
    1
  );

  const actionsQuery = useQuery({
    queryKey: [SINGLE_PRODUCT_QUERY_KEY, PRODUCT_ACTIONS_QUERY_KEY, product.seName],
    queryFn: () =>
      getProductUserActions(product.seName).then((res) => {
        setIsReviewed(res.isReviewed);
        return res;
      }),
    enabled: !!product,
    gcTime: 0,
    refetchOnMount: true
  });

  const productsQuery = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, SIMILAR_QUERY_KEY, product.seName],
    queryFn: () => homeFeedProducts({ page: 1, limit: 4 }).then((res) => res.data),
    enabled: inView
  });
  const products = productsQuery.data ?? [];

  const setCartValues = (attr: ICustomeProductAttribute[], quantity: number) => {
    setCustomAttributes(attr);
    setQuantity(quantity);
  };

  return (
    <>
      <section className="bg-white pb-6 pt-4 antialiased">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="mx-auto max-w-md shrink-0 lg:max-w-md">
              <div className="sticky top-20">
                <ProductCarosel height={500} images={product.pictures} productName={product.name} />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{product.name}</h1>
              <div className="mt-4 sm:flex sm:items-center sm:gap-4">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{product.price.price}$</p>

                <div className="mt-2 flex items-center gap-2 sm:mt-0">
                  <RatingStars rate={parseInt(rating)} size={15} />
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">({rating})</p>
                </div>
              </div>

              <div className="mt-6">
                <ProductAttributes
                  customAttributes={customAttributes}
                  productAttributes={product.productAttributes}
                  onChange={(attr, quantity) => setCartValues(attr, quantity)}
                />
              </div>

              <div className="mt-6 flex items-center gap-4 sm:mt-8">
                {actionsQuery.isPending ? (
                  <ProductActionsLoading />
                ) : (
                  <>
                    <LikeProductButton
                      isLiked={!!actionsQuery?.data?.isLiked}
                      likesCount={product.likes}
                      productId={product._id}
                    />
                    <SaveProductButton
                      isSaved={!!actionsQuery?.data?.isSaved}
                      productId={product._id}
                      savesCount={product.saves}
                    />
                    <AddToCartButton
                      attributes={customAttributes}
                      isInCart={!!actionsQuery.data?.isInCart}
                      product={product}
                      quantity={quantity}
                    />
                  </>
                )}
              </div>

              <hr className="my-6 border-gray-200 md:my-8" />

              <p className="mb-6 text-gray-500">{product.fullDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="my-4 border-t p-4">
        <Reviews isLoading={false} reviews={product.productReviews} />
        {isReviewed ? null : (
          <>
            <h2 className="py-2 text-2xl font-bold">{t("addReview")}</h2>
            <AddReviewForm productId={product._id} onSuccess={() => setIsReviewed(true)} />
          </>
        )}
      </section>

      {/* Similar Products Section */}
      <section className="my-4 border-t p-4">
        <h2 className="p-4 text-2xl font-bold" ref={ref}>
          Similar Products
        </h2>
        <ProductsGridView isLoading={productsQuery.isPending || !productsQuery.data} products={products} />
      </section>
    </>
  );
}
