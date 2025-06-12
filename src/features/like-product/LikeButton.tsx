"use client";

import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import useLike from "@/features/like-product/useLike";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  isLiked: boolean;
  likesCount: number;
}

export default React.memo(function LikeProductButton({ productId, isLiked, likesCount }: Props) {
  const [like, setLike] = useState(() => ({
    state: isLiked,
    count: likesCount
  }));

  const handleLike = useLike({
    productId,
    likesCount,
    onClick: (shouldLike) => setLike({ state: shouldLike, count: like.count + (shouldLike ? 1 : -1) }),
    onError: (shouldLike) => setLike({ state: !shouldLike, count: like.count + (!shouldLike ? 1 : -1) })
  });

  const handleLikeAction = () => handleLike(!like.state);

  return (
    <div className="fill-black text-center">
      <button aria-label="Like Product" className="block rounded-full bg-gray-200 p-2" onClick={handleLikeAction}>
        <AiFillHeart
          className={`transition-all ${like.state ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </button>
      <span className="text-blend text-sm font-semibold">{like.count}</span>
    </div>
  );
});
