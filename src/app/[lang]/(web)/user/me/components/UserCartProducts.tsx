import { CART_QUERY_KEY, PRODUCTS_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import { getCartProducts } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ProductsGridView from "@/components/product/ProductsGridView";
import { BiLoaderCircle } from "react-icons/bi";
import { useTranslation } from "@/context/Translation";

export default function UserCartProducts() {
  const { t } = useTranslation();

  const cartItemsQuery = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, USER_QUERY_KEY, CART_QUERY_KEY],
    queryFn: () => getCartProducts()
  });
  const cartProducts = cartItemsQuery.data ?? [];

  if (cartItemsQuery.isFetching)
    <div className="absolute inset-0 flex justify-center bg-white bg-opacity-50 pt-20 text-primary">
      <BiLoaderCircle className="animate-spin" size={40} />
    </div>;

  if (cartProducts.length > 0) return <ProductsGridView className="p-4" products={cartProducts} />;
  return <div className="py-14 text-center text-gray-400">{t("profile.emptyCart")}</div>;
}
