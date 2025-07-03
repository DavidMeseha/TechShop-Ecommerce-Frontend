"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Input } from "@/common/components/ui/input";
import getProducts from "@/admin/services/getProducts";
import DataPagination from "@/common/components/ui/extend/Pagination";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";
import useDebounce from "@/common/hooks/useDebounce";
import ProductCard from "@/admin/components/product/ProductCard";
import CategorySelect from "@/admin/components/selectors/CategorySelect";
import { ADMIN_PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const isFeltering = !!selectedCategory || !!search;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, page, search, selectedCategory],
    queryFn: () => getProducts({ page: page, limit: 5, query: search, category: selectedCategory }),
    placeholderData: keepPreviousData
  });
  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 1;

  const searchProductNameHandle = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  });

  return (
    <div className="container space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Products Dashboard</h1>
        <div className="w-full md:w-1/3">
          <Input className="w-full" placeholder="Search products..." onChange={searchProductNameHandle} />
        </div>
      </div>

      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-wrap items-center gap-4">
          <CategorySelect
            canUseAllOption
            className="w-36"
            selectedCategoryId={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value);
              setPage(1);
            }}
          />
          <LocalLink
            className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            href="/admin/create-product"
          >
            <Plus size={20} />
            <span>New Product</span>
          </LocalLink>

          {(isLoading || isFetching) && (
            <LoadingSpinner className="inline-block w-auto fill-muted-foreground" size={18} />
          )}
        </div>

        <div className="mt-6 md:mt-0">
          <DataPagination currentPage={currentPage} totalPages={totalPages} onPageChang={(target) => setPage(target)} />
        </div>
      </div>

      <div className="space-y-4">
        {products.length > 0 ? (
          products?.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <div className="flex h-[50vh] items-center justify-center text-center text-muted-foreground">
            {isFeltering ? "No products match the search criteria" : "You have no Products Yet"}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <DataPagination currentPage={currentPage} totalPages={totalPages} onPageChang={(target) => setPage(target)} />
      </div>
    </div>
  );
}
