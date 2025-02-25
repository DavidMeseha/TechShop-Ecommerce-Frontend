"use client";

import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { IFullProduct } from "@/types";
import useLike from "@/hooks/useLike";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  product: IFullProduct;
  isLiked: boolean;
}

export default function LikeProductButton({ product, isLiked }: Props) {
  const [count, setCount] = useState(product.likes);

  const handleLike = useLike({
    product,
    onClick: (shouldLike) => {
      setCount(count + (shouldLike ? 1 : -1));
    }
  });

  const handleLikeAction = () => handleLike(!isLiked);

  return (
    <button aria-label="Like Product" className="fill-black text-center" onClick={handleLikeAction}>
      <div className="rounded-full bg-gray-200 p-2">
        <AiFillHeart
          className={`transition-all ${isLiked ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </div>
      <span className="text-blend text-sm font-semibold">{count}</span>
    </button>
  );
}
