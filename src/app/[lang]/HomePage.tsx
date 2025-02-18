"use client";

import { BsSearch } from "react-icons/bs";
import { BiMenu } from "react-icons/bi";
import { useAppStore } from "@/stores/appStore";
import HomeMenu from "@/components/overlays/HomeMenu";
import { useState } from "react";
import { useTranslation } from "@/context/Translation";
import { IFullProduct, Pagination } from "@/types";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/product/Card";

type Props = {
  products: IFullProduct[];
  loadMore: (page: number) => Promise<{ data: IFullProduct[]; pages: Pagination }>;
};

export default function HomePage({ products, loadMore }: Props) {
  const { setIsHomeMenuOpen, setIsSearchOpen } = useAppStore();
  const { t } = useTranslation();
  const [productsList, setProducts] = useState<IFullProduct[]>([...products]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const loadMoreClick = async () => {
    setLoading(true);
    await loadMore(page + 1).then((res) => {
      if (res.data.length < 1) return setHasMore(false);
      setHasMore(res.pages.hasNext);
      setProducts([...productsList, ...res.data]);
      setPage(page + 1);
    });
    setLoading(false);
  };

  return (
    <>
      <div className="relative">
        <div className="relative mt-4 grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {productsList.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <div className="flex justify-center py-7 text-center">
          {hasMore ? (
            <Button className="bg-primary text-white" isLoading={isLoading} onClick={loadMoreClick}>
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
