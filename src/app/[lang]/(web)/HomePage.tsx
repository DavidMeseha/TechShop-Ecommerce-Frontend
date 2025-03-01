"use client";

import { BsSearch } from "react-icons/bs";
import { BiMenu } from "react-icons/bi";
import HomeMenu from "@/components/overlays/HomeMenu";
import { useTranslation } from "@/context/Translation";
import Button from "@/components/ui/Button";
import ProductsGridView from "@/components/product/ProductsGridView";
import { useOverlayStore } from "@/stores/overlayStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/services/products.service";

export default function HomePage() {
  const setIsHomeMenuOpen = useOverlayStore((state) => state.setIsHomeMenuOpen);
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["homeProducts"],
    queryFn: async ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: 5 }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <div className="relative">
        <ProductsGridView isLoading={isLoading || isFetchingNextPage} limit={5} products={products} />
        <div className="flex justify-center py-7 text-center">
          {hasNextPage ? (
            <Button className="bg-primary text-white" onClick={() => fetchNextPage()}>
              {t("loadMore")}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="fixed end-0 start-0 top-0 z-20 flex w-full justify-between border-b bg-white p-2 md:hidden">
        <Button aria-label="Open Main Menu" className="p-0" onClick={() => setIsHomeMenuOpen(true)}>
          <BiMenu className="fill-black" size={25} />
        </Button>
        <h1 className="text-xl font-bold">{t("home")}</h1>
        <Button aria-label="Open Search Page" className="p-0" onClick={() => setIsSearchOpen(true)}>
          <BsSearch className="fill-black" size={25} />
        </Button>
      </div>
      <HomeMenu />
    </>
  );
}
