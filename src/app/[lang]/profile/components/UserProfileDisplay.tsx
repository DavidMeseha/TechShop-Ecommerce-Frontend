import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { UserActivity } from "./UserActivity";
import Image from "next/image";
import { FiSettings } from "react-icons/fi";
import { BsBookmark, BsCart } from "react-icons/bs";
import { BiLoaderCircle, BiPencil } from "react-icons/bi";
import { LocalLink } from "@/components/LocalizedNavigation";
import { getCartProducts, getSavedProducts, getUserInfo } from "@/services/user.service";
import ProductsGridView from "@/components/product/ProductsGridView";
import { useOverlayStore } from "@/stores/overlayStore";

export default function UserProfileDisplay() {
  const followedVendors = useUserStore((state) => state.followedVendors);
  const isEditProfileOpen = useOverlayStore((state) => state.isEditProfileOpen);
  const setIsEditProfileOpen = useOverlayStore((state) => state.setIsEditProfileOpen);
  const setIsProfileMenuOpen = useOverlayStore((state) => state.setIsProfileMenuOpen);
  const cartItems = useUserStore((state) => state.cartItems);

  const { t } = useTranslation();
  const [isCart, setIsCart] = useState<boolean>(true);

  const cartItemsQuery = useQuery({
    queryKey: ["cartItems"],
    queryFn: () => getCartProducts(),
    enabled: isCart
  });

  const savesQuery = useQuery({
    queryKey: ["savedProducts"],
    queryFn: () => getSavedProducts(),
    enabled: !isCart
  });

  const userInfoQuery = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserInfo()
  });

  const cartProducts = cartItemsQuery.data ?? [];
  const savedProducts = savesQuery.data ?? [];
  const userInfo = userInfoQuery.data;
  const isFeatching = savesQuery.isFetching || cartItemsQuery.isFetching;

  const activities = [
    {
      name: t("profile.following"),
      value: followedVendors.length,
      to: `/profile/following`
    },
    {
      name: t("profile.orders"),
      value: userInfoQuery.data?.ordersCount ?? 0,
      to: `/profile/orders`
    }
  ];

  if (!userInfo) return;

  return (
    <div className="relative pt-4">
      <LocalLink
        className="absolute end-4 top-4 rounded-sm bg-primary px-4 py-2 text-xs text-white md:end-0 md:text-base"
        href="/checkout"
      >
        {t("checkout")} ({cartItems.length})
      </LocalLink>
      <div className="flex w-full flex-col items-center md:mt-0">
        <Image
          alt={userInfo.firstName + " " + userInfo.lastName}
          className="h-[120px] w-[120px] rounded-full object-cover"
          height={130}
          src={userInfo.imageUrl}
          width={130}
        />
        <p className="text-center text-[30px] font-bold">
          {userInfo.firstName + " " + userInfo.lastName}
          <span>
            <button
              className="ms-2 rounded-md bg-lightGray p-1 text-xs font-semibold"
              onClick={() => setIsProfileMenuOpen(true)}
            >
              <FiSettings size={16} />
            </button>
          </span>
          <span>
            <button
              className="ms-2 rounded-md bg-lightGray p-1 text-xs font-semibold md:inline-block"
              onClick={() => setIsEditProfileOpen(!isEditProfileOpen)}
            >
              <BiPencil size={16} />
            </button>
          </span>
        </p>
        <UserActivity activities={activities} />
      </div>

      <div className="relative">
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

        {isCart ? (
          cartProducts.length > 0 ? (
            <ProductsGridView products={cartProducts.map((item) => item.product)} />
          ) : (
            !isFeatching && <div className="py-14 text-center text-secondary">{t("profile.emptyCart")}</div>
          )
        ) : savedProducts.length > 0 ? (
          <ProductsGridView products={savedProducts} />
        ) : (
          !isFeatching && <div className="py-14 text-center text-secondary">{t("profile.noSaves")}</div>
        )}

        {isFeatching ? (
          <div className="absolute inset-0 flex justify-center bg-white bg-opacity-50 pt-20 text-primary">
            <BiLoaderCircle className="animate-spin" size={40} />
          </div>
        ) : null}

        <div className="pb-20" />
      </div>
    </div>
  );
}
