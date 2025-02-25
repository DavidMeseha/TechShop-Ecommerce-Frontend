"use client";

import { BsBookmarkFill } from "react-icons/bs";
import { IFullProduct } from "@/types";
import useSave from "@/hooks/useSave";
import { useState } from "react";

type Props = {
  product: IFullProduct;
  isSaved: boolean;
};

export default function SaveProductButton({ product, isSaved }: Props) {
  const [count, setCount] = useState(product.likes);
  const handleSave = useSave({
    product,
    onClick: (shouldSave) => {
      setCount(count + (shouldSave ? 1 : -1));
    },
    onError: (shouldSave) => {
      setCount(count + (shouldSave ? -1 : 1));
    }
  });

  const handleSaveAction = () => handleSave(!isSaved);
  return (
    <button aria-label="Like Product" className="fill-black text-center" onClick={handleSaveAction}>
      <div className="rounded-full bg-gray-200 p-2">
        <BsBookmarkFill
          className={`transition-all ${isSaved ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </div>
      <span className="text-blend text-sm font-semibold">{count}</span>
    </button>
  );
}
