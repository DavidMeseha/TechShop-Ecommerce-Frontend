import React from "react";
import Button from "../ui/Button";
import { RiBookmark2Line, RiHeart2Line, RiShoppingCartLine } from "react-icons/ri";
import useLike from "@/features/like-product/useLike";
import useSave from "@/features/save-product/useSave";
import useAddToCart from "@/features/add-to-cart/useAddToCart";
import { IFullProduct } from "@/types";

type Props = Pick<IFullProduct, "_id" | "isInCart" | "isLiked" | "isSaved" | "carts" | "saves" | "likes" | "seName">;

export default function ProductCardActions(props: Props) {
  const likeHandler = useLike({ productId: props._id, likesCount: props.likes });
  const saveHandler = useSave({ productId: props._id, savesCount: props.saves });
  const addToCartHandler = useAddToCart({
    product: { _id: props._id, seName: props.seName, carts: props.carts }
  });

  return (
    <div className="mt-4 flex border-t border-gray-200">
      <Button
        aria-label="Add to cart"
        className={`basis-1/3 rounded-none border-e fill-black p-1 ${props.isInCart ? "bg-green-200" : "bg-white"}`}
        isLoading={addToCartHandler.isPending}
        spinnerSize="20"
        onClick={() => addToCartHandler.handleAddToCart(!props.isInCart)}
      >
        <div className="flex items-center justify-center gap-1">
          <RiShoppingCartLine size={20} />
          <span className="hidden text-sm sm:inline">{props.carts}</span>
        </div>
      </Button>
      <Button
        aria-label="like product"
        className={`basis-1/3 rounded-none border-e fill-black p-1 ${props.isLiked ? "bg-red-200" : "bg-white"}`}
        spinnerSize="20"
        onClick={() => likeHandler(!props.isLiked)}
      >
        <div className="flex items-center justify-center gap-1">
          <RiHeart2Line size={20} />
          <span className="hidden text-sm sm:inline">{props.likes}</span>
        </div>
      </Button>
      <Button
        aria-label="save product"
        className={`basis-1/3 rounded-none fill-black p-1 ${props.isSaved ? "bg-yellow-200" : "bg-white"}`}
        spinnerSize="20"
        onClick={() => saveHandler(!props.isSaved)}
      >
        <div className="flex items-center justify-center gap-1">
          <RiBookmark2Line size={20} />
          <span className="hidden text-sm sm:inline">{props.saves}</span>
        </div>
      </Button>
    </div>
  );
}
