"use client";

import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { IFullProduct } from "@/types";
import useLike from "@/hooks/useLike";
import { useUserStore } from "@/stores/userStore";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  product: IFullProduct;
}

export default function LikeProductButton({ product }: Props) {
  const { likes, setLikes } = useUserStore();
  const [count, setCount] = useState(product.likes);
  const inLikes = likes.find((item) => item === product._id);

  const { handleLike } = useLike({
    product,
    onClick: (state) => {
      setCount(count + (state ? 1 : -1));
      const temp = [...likes];
      inLikes ? temp.splice(temp.indexOf(inLikes), 1) : temp.push(product._id);
      setLikes([...temp]);
    }
  });

  const handleLikeAction = () => handleLike(!inLikes);

  return (
    <button aria-label="Like Product" className="fill-black text-center" onClick={handleLikeAction}>
      <div className="rounded-full bg-gray-200 p-2">
        <AiFillHeart
          className={`transition-all ${inLikes ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </div>
      <span className="text-blend text-sm font-semibold">{count}</span>
    </button>
  );
}
