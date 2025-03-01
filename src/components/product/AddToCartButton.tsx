import React, { useState } from "react";
import { IFullProduct, IProductAttribute } from "@/types";
import { BsCartFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import useAddToCart from "@/hooks/useAddToCart";

type Props = {
  product: IFullProduct;
  attributes?: IProductAttribute[];
  isInCart: boolean;
};

export default React.memo(function AddToCartButton({ product, attributes, isInCart }: Props) {
  const [count, setCount] = useState(product.carts);

  const { handleAddToCart, isPending } = useAddToCart({
    product,
    onSuccess: (state) => {
      setCount(count + (state ? 1 : -1));
    }
  });

  const addToCart = () => handleAddToCart(!isInCart, attributes);

  return (
    <button aria-label="Product add to cart" className="fill-black text-center" onClick={addToCart}>
      <div className="rounded-full bg-gray-200 p-2">
        {isPending ? (
          <BiLoaderCircle className="animate-spin" size="25" />
        ) : (
          <BsCartFill
            className={`p-0.5 transition-all ${isInCart ? "fill-primary" : ""} hover:fill-primary`}
            size="25"
          />
        )}
      </div>
      <span className="text-blend text-xs font-semibold">{count}</span>
    </button>
  );
});
