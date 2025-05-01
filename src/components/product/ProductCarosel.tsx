"use client";

import React, { useEffect, useState } from "react";
import { IPicture } from "@/types";
import Image from "next/image";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "../ui/CarouselIndecator";

type Props = {
  images: IPicture[];
  productName: string;
  height?: number;
};

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshIR0dIiIdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export default function ProductCarosel({ images, productName, height }: Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [caroselImageIndex, setCaroselImageIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("scroll", (emblaApi) => setCaroselImageIndex(emblaApi.selectedScrollSnap()));
    return () => carouselApi.destroy();
  }, [carouselApi]);

  if (images.length > 1)
    return (
      <div className="relative h-full" style={{ height: `${height}px` }}>
        <Carousel className="h-full w-full [&>div]:h-full" dir="ltr" setApi={setCarouselApi}>
          <CarouselContent className="h-full">
            {images.map((img) => (
              <CarouselItem className="relative flex h-full items-center" key={img.imageUrl + img._id}>
                <Image
                  alt={productName}
                  blurDataURL={BLUR_DATA_URL}
                  className="h-full w-full object-contain"
                  height={480}
                  loading="eager"
                  placeholder="blur"
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={img.imageUrl}
                  width={260}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <CarouselIndecator
          array={images}
          className="absolute bottom-0 p-4"
          selectedIndex={caroselImageIndex}
          setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
        />
      </div>
    );

  return (
    <div className="h-full w-full" style={{ height: height + "px" }}>
      <Image
        alt={productName}
        blurDataURL={BLUR_DATA_URL}
        className="h-full w-full object-contain"
        height={480}
        loading="eager"
        placeholder="blur"
        priority
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={images[0]?.imageUrl ?? "/images/placeholder.png"}
        width={260}
      />
    </div>
  );
}
