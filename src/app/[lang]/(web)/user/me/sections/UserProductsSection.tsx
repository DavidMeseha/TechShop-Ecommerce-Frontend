"use client";

import React, { useState } from "react";
import { BsBookmark, BsCart } from "react-icons/bs";
import UserCartProducts from "../components/UserCartProducts";
import UserSavedProducts from "../components/UserSavedProducts";

export default function UserProductsSection() {
  const [isCart, setIsCart] = useState<boolean>(true);

  return (
    <div className="relative pb-20">
      <ul className="sticky top-[45px] z-10 mt-2 flex w-full items-center border-b border-t-[1px] bg-white md:top-0">
        <li className={`w-full ${isCart && "-mb-0.5 border-b-2 border-b-black"}`}>
          <a className="flex justify-center py-2" onClick={() => setIsCart(true)}>
            <BsCart size={20} />
          </a>
        </li>
        <li className={`w-full ${!isCart && "-mb-0.5 border-b-2 border-b-black"}`}>
          <a className="flex justify-center py-2" onClick={() => setIsCart(false)}>
            <BsBookmark size={20} />
          </a>
        </li>
      </ul>

      {isCart ? <UserCartProducts /> : <UserSavedProducts />}
    </div>
  );
}
