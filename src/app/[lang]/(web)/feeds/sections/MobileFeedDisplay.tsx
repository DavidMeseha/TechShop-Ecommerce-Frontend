import { IFullProduct } from "@/types";
import React from "react";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";
import { useOverlayStore } from "@/common/stores/overlayStore";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { BiMenu } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import MobileProductScreen from "../components/MobilePost";

type Props = {
  products: IFullProduct[];
  isFetchingNextPage: boolean;
};

export default function MobileFeedDisplay({ products, isFetchingNextPage }: Props) {
  const setIsHomeMenuOpen = useOverlayStore((state) => state.setIsHomeMenuOpen);
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);

  return (
    <div className="block md:hidden">
      <div className="fixed end-0 start-0 top-0 z-20 w-full px-2 md:hidden">
        <div className="flex justify-between py-2">
          <SubmitButton aria-label="Open Main Menu" onClick={() => setIsHomeMenuOpen(true)}>
            <BiMenu className="fill-white" size={35} />
          </SubmitButton>
          <div className="w-6" />
          <SubmitButton aria-label="Open Search Page" onClick={() => setIsSearchOpen(true)}>
            <BsSearch className="fill-white" size={30} />
          </SubmitButton>
        </div>
      </div>
      <div className="relative">
        {products.map((product) => (
          <MobileProductScreen isFollowed={product.vendor.isFollowed} key={product._id + "-mobile"} product={product} />
        ))}
      </div>
      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
}
