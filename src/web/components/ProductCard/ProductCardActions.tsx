import React from "react";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import {
  RiBookmark2Fill,
  RiBookmark2Line,
  RiHeart2Fill,
  RiHeart2Line,
  RiShoppingCartFill,
  RiShoppingCartLine
} from "react-icons/ri";
import useLike from "@/web/features/like-product/useLike";
import useSave from "@/web/features/save-product/useSave";
import useAddToCart from "@/web/features/add-to-cart/useAddToCart";
import { IFullProduct } from "@/types";
import { Button } from "@/common/components/ui/button";

type Props = Pick<IFullProduct, "_id" | "isInCart" | "isLiked" | "isSaved" | "carts" | "saves" | "likes" | "seName">;

export default function ProductCardActions(props: Props) {
  const likeHandler = useLike({ productId: props._id, likesCount: props.likes });
  const saveHandler = useSave({ productId: props._id, savesCount: props.saves });
  const addToCartHandler = useAddToCart({
    product: { _id: props._id, seName: props.seName, carts: props.carts }
  });

  return (
    <div className="mt-4 flex border-t border-gray-200">
      <SubmitButton
        aria-label="Add to cart"
        className={`h-auto w-auto basis-1/3 rounded-none border-e bg-white fill-black p-1 text-black hover:bg-slate-100`}
        isLoading={addToCartHandler.isPending}
        onClick={() => addToCartHandler.handleAddToCart(!props.isInCart)}
      >
        <div className="flex items-center justify-center gap-1">
          {props.isInCart ? (
            <RiShoppingCartFill className="fill-green-600" size={20} />
          ) : (
            <RiShoppingCartLine className="fill-black" size={20} />
          )}
          <span className="hidden text-sm sm:inline">{props.carts}</span>
        </div>
      </SubmitButton>
      <Button
        aria-label="like product"
        className={`h-auto w-auto basis-1/3 rounded-none border-e bg-transparent p-1 text-black hover:bg-slate-100`}
        onClick={() => likeHandler(!props.isLiked)}
      >
        <div className="flex items-center justify-center gap-1">
          {props.isLiked ? (
            <RiHeart2Fill className="fill-red-600 stroke-red-600 stroke-2" size={20} />
          ) : (
            <RiHeart2Line className="fill-black" size={20} />
          )}
          <span className="hidden text-sm sm:inline">{props.likes}</span>
        </div>
      </Button>
      <Button
        aria-label="save product"
        className={`h-auto w-auto basis-1/3 rounded-none bg-transparent fill-black p-1 text-black hover:bg-slate-100`}
        onClick={() => saveHandler(!props.isSaved)}
      >
        <div className="flex items-center justify-center gap-1">
          {props.isSaved ? (
            <RiBookmark2Fill className="fill-yellow-600" />
          ) : (
            <RiBookmark2Line className="fill-black" size={20} />
          )}
          <span className="hidden text-sm sm:inline">{props.saves}</span>
        </div>
      </Button>
    </div>
  );
}
