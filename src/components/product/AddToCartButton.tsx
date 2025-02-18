import React, { useState } from "react";
import { IFullProduct, IProductAttribute } from "@/types";
import { BsCartFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import useAddToCart from "@/hooks/useAddToCart";
import { useUserStore } from "@/stores/userStore";

type Props = {
  product: IFullProduct;
  isLoading?: boolean;
  attributes?: IProductAttribute[];
};

export default function AddToCartButton({ product, attributes }: Props) {
  const { cartItems, setCartItems } = useUserStore();
  const [count, setCount] = useState(product.carts);
  const inCart = cartItems.find((item) => item.product === product._id);

  const { handleAddToCart, isPending } = useAddToCart({
    product,
    onSuccess: (state) => {
      setCount(count + (state ? 1 : -1));
      const temp = [...cartItems];
      inCart ? temp.splice(temp.indexOf(inCart), 1) : temp.push({ product: product._id, quantity: 1 });
      setCartItems([...temp]);
    }
  });

  const addToCart = () => handleAddToCart(!inCart, attributes);

  return (
    <button aria-label="Product add to cart" className="fill-black text-center" onClick={addToCart}>
      <div className="rounded-full bg-gray-200 p-2">
        {isPending ? (
          <BiLoaderCircle className="animate-spin" size="25" />
        ) : (
          <BsCartFill className={`p-0.5 transition-all ${inCart ? "fill-primary" : ""} hover:fill-primary`} size="25" />
        )}
      </div>
      <span className="text-blend text-xs font-semibold">{count}</span>
    </button>
  );
}
