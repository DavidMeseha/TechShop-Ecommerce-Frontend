"use client";

import { BsSearch } from "react-icons/bs";
import { BiMenu } from "react-icons/bi";
import ProductSectionMobile from "@/components/product/ProductSectionMobile";
import HomeMenu from "@/components/overlays/HomeMenu";
import { useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/context/Translation";
import Button from "@/components/ui/Button";
import ProductSection from "@/components/product/ProductSection";
import { useOverlayStore } from "@/stores/overlayStore";
import { useUserStore } from "@/stores/userStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/services/products.service";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";

export default function InfiniteFeed() {
  const { t } = useTranslation();
  const setIsHomeMenuOpen = useOverlayStore((state) => state.setIsHomeMenuOpen);
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);

  const cartItems = useUserStore((state) => state.cartItems);
  const saves = useUserStore((state) => state.saves);
  const likes = useUserStore((state) => state.likes);
  const reviews = useUserStore((state) => state.reviews);
  const followedVendors = useUserStore((state) => state.followedVendors);

  const isInCart = useCallback((id: string) => !!cartItems.find((item) => item.product === id), [cartItems]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["feedProducts"],
    queryFn: async ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: 3 }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });

  const [ref] = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  });

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="relative">
      <div className="hidden md:block">
        <div className="relative mx-auto mt-12 max-w-[680px] md:mt-0">
          {allProducts.map((product) => (
            <ProductSection
              isFollowed={followedVendors.includes(product.vendor._id)}
              isInCart={isInCart(product._id)}
              isLiked={likes.includes(product._id)}
              isRated={reviews.includes(product._id)}
              isSaved={saves.includes(product._id)}
              key={product._id}
              product={product}
            />
          ))}

          {isFetchingNextPage ? <LoadingSpinner /> : !hasNextPage ? t("endOfContent") : null}
        </div>
      </div>
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
              isFollowed={followedVendors.includes(product.vendor._id)}
              isInCart={isInCart(product._id)}
              isLiked={likes.includes(product._id)}
              isRated={reviews.includes(product._id)}
              isSaved={saves.includes(product._id)}
              key={product._id + "-mobile"}
              product={product}
            />
          ))}
        </div>
        {isFetchingNextPage ? <LoadingSpinner /> : !hasNextPage ? t("endOfContent") : null}
      </div>
      <HomeMenu />
      <div className="absolute bottom-0 -z-40 h-screen w-full md:h-[700px]" data-testid="load-more" ref={ref}></div>
    </div>
  );
}
