"use client";

import { BsSearch } from "react-icons/bs";
import { BiMenu } from "react-icons/bi";
import ProductSectionMobile from "@/components/product/ProductSectionMobile";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/context/Translation";
import Button from "@/components/ui/Button";
import ProductSection from "@/components/product/ProductSection";
import { useOverlayStore } from "@/stores/overlayStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/services/products.service";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";

export default function FeedsPage() {
  const { t } = useTranslation();
  const setIsHomeMenuOpen = useOverlayStore((state) => state.setIsHomeMenuOpen);
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["feedProducts"],
    queryFn: async ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: 3 }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });
  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  const [ref] = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  });

  return (
    <>
      <div className="hidden md:block">
        <div className="mt-6">
          {allProducts.map((product) => (
            <ProductSection key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/*------------mobile snap view---------*/}
      <div className="block md:hidden">
        <div className="fixed end-0 start-0 top-0 z-20 w-full px-2 md:hidden">
          <div className="flex justify-between py-2">
            <Button aria-label="Open Main Menu" onClick={() => setIsHomeMenuOpen(true)}>
              <BiMenu className="fill-white" size={35} />
            </Button>
            <div className="w-6" />
            <Button aria-label="Open Search Page" onClick={() => setIsSearchOpen(true)}>
              <BsSearch className="fill-white" size={30} />
            </Button>
          </div>
        </div>
        <div className="relative">
          {allProducts.map((product) => (
            <ProductSectionMobile
              isFollowed={product.vendor.isFollowed}
              key={product._id + "-mobile"}
              product={product}
            />
          ))}
        </div>
        {isFetchingNextPage ? <LoadingSpinner /> : null}
      </div>

      {hasNextPage ? (
        <>
          <div className="absolute bottom-0 -z-10 h-screen md:h-[700px]" data-testid="load-more" ref={ref}></div>
          <LoadingSpinner className="py-6" />
        </>
      ) : (
        <div className="py-4 text-center text-muted-foreground">{t("endOfContent")}</div>
      )}
    </>
  );
}
