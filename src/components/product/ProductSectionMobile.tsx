"use client";

import React, { useEffect, useState } from "react";
import { IFullProduct } from "../../types";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "../ui/CarouselIndecator";
import ProductVendorButton from "./VendorButton";
import LikeProductButton from "./LikeButton";
import RateProductButton from "./RateButton";
import SaveProductButton from "./SaveButton";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import ViewMoreButton from "../ui/ViewMoreButton";

type Props = {
  product: IFullProduct;
  isLiked: boolean;
  isSaved: boolean;
  isInCart: boolean;
  isRated: boolean;
  isFollowed: boolean;
};

export default React.memo(
  function ProductSectionMobile({ product, isLiked, isSaved, isInCart, isRated, isFollowed }: Props) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [caroselImageIndex, setCaroselImageIndex] = useState(0);

    useEffect(() => {
      if (!carouselApi) return;
      carouselApi.on("scroll", (emblaApi) => setCaroselImageIndex(emblaApi.selectedScrollSnap()));
      return () => carouselApi.destroy();
    }, [carouselApi]);

    return (
      <>
        <div className="relative h-screen w-full snap-start bg-black" id={product._id}>
          <div className="relative flex h-[calc(100dvh-58px)] items-center">
            <Carousel className="w-full" dir="ltr" setApi={setCarouselApi}>
              <CarouselContent>
                {product.pictures.map((img, index) => (
                  <CarouselItem key={index}>
                    <Image
                      alt={product.name}
                      className="object-cover"
                      height={760}
                      loading="eager"
                      priority
                      src={img.imageUrl}
                      style={{ width: "100%", height: "auto" }}
                      width={760}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="absolute bottom-0 flex h-16 w-full justify-center bg-gradient-to-t from-black to-transparent">
              <CarouselIndecator
                array={product.pictures}
                selectedIndex={caroselImageIndex}
                setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
              />
            </div>

            <div className="absolute bottom-1 end-0">
              <div className="relative bottom-0 end-0 flex flex-col items-center gap-2 p-4">
                <ViewMoreButton product={product} />
                <ProductVendorButton isFollowed={isFollowed} vendor={product.vendor} />
                <LikeProductButton isLiked={isLiked} product={product} />
                <RateProductButton isRated={isRated} product={product} />
                <SaveProductButton isSaved={isSaved} product={product} />
                <AddToCartButton isInCart={isInCart} product={product} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSaved === nextProps.isSaved &&
      prevProps.isInCart === nextProps.isInCart &&
      prevProps.isLiked === nextProps.isLiked &&
      prevProps.isRated === nextProps.isRated &&
      prevProps.product._id === nextProps.product._id
    );
  }
);
