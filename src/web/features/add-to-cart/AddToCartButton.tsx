import React, { useState } from "react";
import { ICustomeProductAttribute, IFullProduct } from "@/types";
import { BsCartFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import useAddToCart from "@/web/features/add-to-cart/useAddToCart";

type Props = {
  product: IFullProduct;
  attributes?: ICustomeProductAttribute[];
  isInCart: boolean;
  quantity?: number;
};

export default React.memo(function AddToCartButton({ product, attributes, isInCart, quantity }: Props) {
  const [cart, setCart] = useState(() => ({
    state: isInCart,
    count: product.carts
  }));

  const { handleAddToCart, isPending } = useAddToCart({
    product: { _id: product._id, seName: product.seName, carts: product.carts },
    onSuccess: (shouldAdd) => setCart({ state: shouldAdd, count: cart.count + (shouldAdd ? 1 : -1) })
  });

  const addToCart = () => handleAddToCart(!cart.state, quantity ?? 1, attributes);

  return (
    <button className="fill-black text-center" onClick={addToCart}>
      <div aria-label="Product add to cart" className="rounded-full bg-gray-200 p-2">
        {isPending ? (
          <BiLoaderCircle className="animate-spin" size="25" />
        ) : (
          <BsCartFill
            className={`p-0.5 transition-all ${cart.state ? "fill-primary" : ""} hover:fill-primary`}
            size="25"
          />
        )}
      </div>
      <span className="text-blend text-xs font-semibold">{cart.count}</span>
    </button>
  );
});
