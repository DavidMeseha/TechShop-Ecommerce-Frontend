"use client";

import { LocalLink } from "@/components/LocalizedNavigation";
import LikeProductButton from "./LikeButton";
import AddToCartButton from "./AddToCartButton";
import SaveProductButton from "./SaveButton";
import Image from "next/image";
import { IFullProduct } from "@/types";
import RateProductButton from "./RateButton";

export interface CommentsHeaderCompTypes {
  product: IFullProduct;
}

export default function ProductHeader({ product }: CommentsHeaderCompTypes) {
  return (
    <>
      <div className="flex items-center px-8 pt-4">
        <LocalLink href={`/profile/vendor/${product.vendor.seName}`}>
          <Image
            alt="comment profile"
            className="mx-auto h-10 w-10 rounded-full object-cover lg:mx-0"
            height={50}
            src={product.vendor.imageUrl}
            width={50}
          />
        </LocalLink>
        <div className="ml-3 pt-0.5">
          <div className="relative z-10 font-semibold hover:underline">{product.name}</div>

          <div className="relative text-sm text-secondary">
            by:
            <LocalLink className="hover:text-primary" href={`/profile/vendor/${product.vendor.seName}`}>
              {" " + product.vendor.name}
            </LocalLink>
          </div>
        </div>
      </div>

      <p className="mt-4 px-8 text-sm" dangerouslySetInnerHTML={{ __html: product?.fullDescription }}></p>

      <div className="mb-4 mt-8 flex items-center gap-2 px-8">
        <LikeProductButton product={product} />
        <SaveProductButton product={product} />
        <AddToCartButton product={product} />
        <RateProductButton product={product} />
      </div>
    </>
  );
}
