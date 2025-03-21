"use client";
import AddToCartButton from "@/components/product/AddToCartButton";
import LikeProductButton from "@/components/product/LikeButton";
import ProductAttributes from "@/components/product/Attributes";
import RatingStars from "@/components/ui/RatingStars";
import SaveProductButton from "@/components/product/SaveButton";
import { selectDefaultAttributes } from "@/lib/misc";
import { IFullProduct, IProductAttribute } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import { homeFeedProducts } from "@/services/products.service";
import ProductsGridView from "@/components/product/ProductsGridView";
import ProductCarosel from "@/components/product/ProductCarosel";
import ProductReviews from "../Reviews";
import AddReviewForm from "../forms/AddReviewForm";
import { getActualProductReview } from "@/stores/tempActionsCache";

type Props = {
  product: IFullProduct;
};

export default function ProductPage({ product }: Props) {
  const [isReviewed, setIsReviewed] = useState(getActualProductReview(product._id, product.isReviewed));
  const [customAttributes, setCustomAttributes] = useState(selectDefaultAttributes(product.productAttributes));
  const [ref, inView] = useInView();
  const rating = (product.productReviewOverview.ratingSum / (product.productReviewOverview.totalReviews || 1)).toFixed(
    1
  );

  const productsQuery = useQuery({
    queryKey: ["similarProducts", product.seName],
    queryFn: () => homeFeedProducts({ page: 1, limit: 4 }).then((res) => res.data),
    enabled: inView
  });
  const products = productsQuery.data ?? [];

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
    <>
      <section className="bg-white pb-6 pt-4 antialiased">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="mx-auto max-w-md shrink-0 lg:max-w-md">
              <ProductCarosel height={500} images={product.pictures} productName={product.name} />
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
                  handleChange={handleAttributesChange}
                  productAttributes={product.productAttributes}
                />
              </div>

              <div className="mt-6 flex items-center gap-4 sm:mt-8">
                <LikeProductButton isLiked={product.isLiked} likesCount={product.likes} productId={product._id} />
                <SaveProductButton isSaved={product.isSaved} productId={product._id} savesCount={product.saves} />
                <AddToCartButton attributes={customAttributes} product={product} />
              </div>

              <hr className="my-6 border-gray-200 md:my-8" />

              <p className="mb-6 text-gray-500">{product.fullDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="my-4 border-t p-4">
        <ProductReviews reviews={product.productReviews} />
        {isReviewed ? null : (
          <>
            <h4 className="py-2 text-2xl font-bold">Add Review</h4>
            <AddReviewForm productId={product._id} onSuccess={() => setIsReviewed(true)} />
          </>
        )}
      </section>

      {/* Similar Products Section */}
      <section className="my-4 border-t p-4">
        <h3 className="p-4 text-2xl font-bold" ref={ref}>
          Similar Products
        </h3>
        <ProductsGridView isLoading={productsQuery.isPending || !productsQuery.data} products={products} />
      </section>
    </>
  );
}
