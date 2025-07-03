import React from "react";
import ProductsPage from "./ProductsPage";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import configureServerRequest from "@/common/services/server/configureServerRequest";
import getProducts from "@/admin/services/getProducts";
import { ADMIN_PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";

export default async function page() {
  const queryClient = new QueryClient();
  await configureServerRequest();

  await queryClient.prefetchQuery({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, 1, "", ""],
    queryFn: () => getProducts({ page: 1, limit: 5, query: "", category: "" })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsPage />
    </HydrationBoundary>
  );
}
