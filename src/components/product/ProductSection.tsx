"use client";

import React, { useMemo, useRef, useState } from "react";
import { LocalLink } from "@/components/LocalizedNavigation";
import LikeProductButton from "./LikeButton";
import RateProductButton from "./RateButton";
import SaveProductButton from "./SaveButton";
import AddToCartButton from "./AddToCartButton";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import { manipulateDescription } from "@/lib/misc";
import { IFullProduct } from "@/types";
import Button from "../ui/Button";
import ViewMoreButton from "../ui/ViewMoreButton";
import useFollow from "@/hooks/useFollow";
import ProductCarosel from "./ProductCarosel";

type Props = {
  product: IFullProduct;
  isLiked: boolean;
  isSaved: boolean;
  isInCart: boolean;
  isRated: boolean;
  isFollowed: boolean;
};

function ProductSection({ product, isLiked, isSaved, isInCart, isRated, isFollowed }: Props) {
  const { t } = useTranslation();
  const [readMore, setReadMore] = useState(false);
  const descriptionRef = useRef(manipulateDescription(product.fullDescription));
  const [main, extend] = useMemo(() => descriptionRef.current, [descriptionRef.current]);

  const handleFollow = useFollow({ vendor: product.vendor });

  return (
    <div className="flex items-start border-b py-6">
      <div className="min-w-14">
        <LocalLink aria-label="Navigate to specific vendor profile" href={`/vendor/${product.vendor.seName}`}>
          <Image
            alt={product.vendor.name}
            className="h-14 w-14 rounded-full object-cover"
            height={56}
            loading="lazy"
            sizes=""
            src={product.vendor.imageUrl}
            width={56}
          />
        </LocalLink>
      </div>

      <div className="grow pe-4 ps-3">
        <div className="flex items-center justify-between pb-1">
          <div>
            <LocalLink
              aria-label="Navigate to product page"
              className="cursor-pointer font-bold hover:underline"
              href={`/vendor/${product.vendor.seName}`}
            >
              {product.vendor.name}
            </LocalLink>
            <p className="text-sm text-gray-400">
              <LocalLink className="inline-block h-6 hover:text-primary" href={`/product/${product.seName}`}>
                {product.name}
              </LocalLink>
            </p>
          </div>

          <Button
            className="border border-primary bg-white fill-primary px-5 py-0.5 text-sm font-semibold text-primary hover:bg-[#ffeef2]"
            onClick={() => handleFollow(!isFollowed)}
          >
            {isFollowed ? t("unfollow") : t("follow")}
          </Button>
        </div>
        <p className="w-[calc(100%-160px)] text-[15px]">
          <span>{main}</span>
          {readMore ? <span>{extend}</span> : null}
          {extend.length > 0 ? (
            <>
              {!readMore && <span>...</span>}
              <span
                aria-label="read more"
                className="cursor-pointer text-sm text-primary hover:underline"
                onClick={() => setReadMore(!readMore)}
              >
                {" "}
                {readMore ? t("readLess") : t("readMore")}
              </span>
            </>
          ) : null}
        </p>
        <div className="text-sm text-gray-400">
          {product.productTags.map((tag) => (
            <LocalLink
              aria-label="Navigate to a tag products"
              className="me-4 inline-block h-6 hover:underline"
              dir="ltr"
              href={`/tag/${tag.seName}`}
              key={tag._id}
            >
              #{tag.name}
            </LocalLink>
          ))}
        </div>

        <div className="mt-2.5 flex items-end">
          <div className="relative flex h-[480px] w-[260px] cursor-grab items-center overflow-hidden rounded-xl bg-black">
            <ProductCarosel images={product.pictures} productName={product.name} />
          </div>
          <div className="relative flex flex-col items-center gap-2 p-2">
            <ViewMoreButton product={product} />
            <LikeProductButton isLiked={isLiked} product={product} />
            <RateProductButton isRated={isRated} product={product} />
            <SaveProductButton isSaved={isSaved} product={product} />
            <AddToCartButton isInCart={isInCart} product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductSection, (prev, next) => {
  return (
    prev.isFollowed === next.isFollowed &&
    prev.isLiked === next.isLiked &&
    prev.isRated === next.isRated &&
    prev.isSaved === next.isSaved &&
    prev.isInCart === next.isInCart &&
    prev.product._id === next.product._id
  );
});
