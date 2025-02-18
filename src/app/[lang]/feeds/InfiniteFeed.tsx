"use client";

import { BsSearch } from "react-icons/bs";
import { BiLoaderCircle, BiMenu } from "react-icons/bi";
import ProductSectionMobile from "@/components/product/ProductSectionMobile";
import { useAppStore } from "@/stores/appStore";
import HomeMenu from "@/components/overlays/HomeMenu";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/context/Translation";
import { IFullProduct, Pagination } from "../../../types";
import Button from "@/components/ui/Button";
import ProductSection from "@/components/product/ProductSection";

type Props = {
  products: IFullProduct[];
  loadMore: (page: number) => Promise<{ data: IFullProduct[]; pages: Pagination }>;
};

export default function InfiniteFeed({ products, loadMore }: Props) {
  const { setIsHomeMenuOpen, setIsSearchOpen } = useAppStore();
  const { t } = useTranslation();

  const [productsList, setProducts] = useState<IFullProduct[]>([...products]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (isInView && hasMore && loadMore) {
      loadMore(page + 1).then((res) => {
        if (res.data.length < 1) return setHasMore(false);
        setHasMore(res.pages.hasNext);
        setProducts([...productsList, ...res.data]);
        setPage(page + 1);
      });
    }
  }, [isInView]);

  return (
    <div className="relative">
      <div className="hidden md:block">
        <div className="relative mx-auto mt-12 max-w-[680px] md:mt-0">
          {productsList.map((product, index) => (
            <ProductSection key={index} product={product} />
          ))}
          <div className="flex justify-center py-7 text-center">
            {hasMore ? <BiLoaderCircle className="animate-spin fill-primary" data-testid="loading" size={35} /> : null}
          </div>
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
          {productsList.length > 0
            ? productsList.map((product, index) => <ProductSectionMobile key={index} product={product} />)
            : null}
        </div>
        <div className="flex justify-center py-7 text-center">
          {hasMore ? (
            <BiLoaderCircle className="animate-spin fill-primary" data-testid="loading" size={35} />
          ) : (
            t("endOfContent")
          )}
        </div>
      </div>
      <HomeMenu />
      <div className="absolute bottom-0 -z-40 h-screen w-full md:h-[700px]" data-testid="load-more" ref={ref}></div>
    </div>
  );
}
