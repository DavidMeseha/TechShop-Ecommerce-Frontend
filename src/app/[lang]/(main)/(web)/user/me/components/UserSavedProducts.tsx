import { PRODUCTS_QUERY_KEY, SAVED_PRODUCTS_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";
import { getSavedProducts } from "@/web/services/user.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ProductsGridView from "@/web/components/product/ProductsGridView";
import { useTranslation } from "@/common/context/Translation";
import { BiLoaderCircle } from "react-icons/bi";

export default function UserSavedProducts() {
  const { t } = useTranslation();

  const savesQuery = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, USER_QUERY_KEY, SAVED_PRODUCTS_QUERY_KEY],
    queryFn: () => getSavedProducts()
  });
  const savedProducts = savesQuery.data ?? [];

  if (savesQuery.isFetching)
    <div className="absolute inset-0 flex justify-center bg-white bg-opacity-50 pt-20 text-primary">
      <BiLoaderCircle className="animate-spin" size={40} />
    </div>;

  if (savedProducts.length > 0) return <ProductsGridView className="p-4" products={savedProducts} />;
  return <div className="py-14 text-center text-gray-400">{t("profile.noSaves")}</div>;
}
