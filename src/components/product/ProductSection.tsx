"use client";

import React, { useEffect, useRef, useState } from "react";
import { LocalLink } from "@/components/LocalizedNavigation";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "../ui/CarouselIndecator";
import LikeProductButton from "./LikeButton";
import RateProductButton from "./RateButton";
import SaveProductButton from "./SaveButton";
import AddToCartButton from "./AddToCartButton";
import { useTranslation } from "@/context/Translation";
import Image from "next/image";
import { manipulateDescription } from "@/lib/misc";
import { IFullProduct } from "@/types";
import { useUserStore } from "@/stores/userStore";
import Button from "../ui/Button";
import ViewMoreButton from "../ui/ViewMoreButton";
import useFollow from "@/hooks/useFollow";

export default function ProductSection({ product }: { product: IFullProduct }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [caroselImageIndex, setCaroselImageIndex] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const { t } = useTranslation();
  const { following } = useUserStore();
  const descriptionRef = useRef(manipulateDescription(product.fullDescription));
  const [main, extend] = descriptionRef.current;
  const isFollowed = following.includes(product.vendor._id);

  const { handleFollow } = useFollow({ vendor: product.vendor });

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("scroll", (emblaApi) => setCaroselImageIndex(emblaApi.selectedScrollSnap()));
    return () => carouselApi.destroy();
  }, [carouselApi]);

  return (
    <div className="flex items-start border-b py-6">
      <div className="w-11">
        <LocalLink aria-label="Navigate to specific vendor profile" href={`/profile/vendor/${product.vendor.seName}`}>
          <Image
            alt={product.vendor.name}
            className="h-14 w-14 rounded-full object-cover"
            height={56}
            loading="lazy"
            sizes=""
            src={product.vendor?.imageUrl}
            width={56}
          />
        </LocalLink>
      </div>

      <div className="grow pe-4 ps-3">
        <div className="flex items-center justify-between pb-1">
          <div>
            <LocalLink
              aria-label="Navigate to product page"
              className="cursor-pointer font-bold hover:underline"
              href={`/profile/vendor/${product.vendor.seName}`}
            >
              {product.vendor.name}
            </LocalLink>
            <p className="text-sm text-secondary">
              <LocalLink className="inline-block h-6 hover:text-primary" href={`/product/${product.seName}`}>
                {product.name}
              </LocalLink>
            </p>
          </div>

          <Button
            className="border border-primary bg-white fill-primary px-5 py-0.5 text-sm font-semibold text-primary hover:bg-[#ffeef2]"
            onClick={() => handleFollow(!isFollowed)}
          >
            {isFollowed ? t("unfollow") : t("follow")}
          </Button>
        </div>
        <p className="max-w-[300px] text-[15px] md:max-w-[400px]">
          <span>{main}</span>
          {readMore ? <span>{extend}</span> : null}
          {extend.length > 0 ? (
            <>
              {!readMore && <span>...</span>}
              <span
                aria-label="read more"
                className="cursor-pointer text-sm text-primary hover:underline"
                onClick={() => setReadMore(!readMore)}
              >
                {" "}
                {readMore ? t("readLess") : t("readMore")}
              </span>
            </>
          ) : null}
        </p>
        <div className="text-sm text-secondary">
          {product.productTags.map((tag) => (
            <LocalLink
              aria-label="Navigate to a tag products"
              className="me-4 inline-block h-6 hover:underline"
              dir="ltr"
              href={`/profile/tag/${tag.seName}`}
              key={tag._id}
            >
              #{tag.name}
            </LocalLink>
          ))}
        </div>

        <div className="mt-2.5 flex items-end">
          <div className="relative flex h-[480px] w-[260px] cursor-grab items-center overflow-hidden rounded-xl bg-black">
            {product.pictures.length > 1 ? (
              <>
                <Carousel className="w-full" dir="ltr" setApi={setCarouselApi}>
                  <CarouselContent>
                    {product.pictures.map((img) => (
                      <CarouselItem className="relative flex h-[480px] items-center" key={img._id}>
                        <Image
                          alt={product.name}
                          className="object-cover md:w-full"
                          height={480}
                          loading="eager"
                          priority
                          src={img.imageUrl}
                          width={260}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <CarouselIndecator
                  array={product.pictures}
                  className="absolute bottom-0 p-4"
                  selectedIndex={caroselImageIndex}
                  setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
                />
              </>
            ) : (
              <Image
                alt={product.name}
                className="object-contain md:w-full"
                height={480}
                loading="eager"
                priority
                src={product.pictures[0]?.imageUrl ?? "/images/placeholder.png"}
                width={260}
              />
            )}
          </div>
          <div className="relative flex flex-col items-center gap-2 p-2">
            <ViewMoreButton product={product} />
            <LikeProductButton product={product} />
            <RateProductButton product={product} />
            <SaveProductButton product={product} />
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
