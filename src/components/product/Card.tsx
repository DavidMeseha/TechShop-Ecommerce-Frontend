import { IFullProduct } from "@/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { LocalLink } from "../LocalizedNavigation";
import { RiBookmark2Line, RiHeart2Line, RiShoppingCartLine } from "react-icons/ri";
import { useUserStore } from "@/stores/userStore";
import Button from "../ui/Button";
import useLike from "@/hooks/useLike";
import useSave from "@/hooks/useSave";
import useAddToCart from "@/hooks/useAddToCart";
import RatingStars from "../ui/RatingStars";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarouselIndecator from "../ui/CarouselIndecator";
import { useAppStore } from "@/stores/appStore";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  product: IFullProduct;
};

export default function ProductCard({ product }: Props) {
  const queryClient = useQueryClient();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [caroselImageIndex, setCaroselImageIndex] = useState(0);
  const { cartItems, likes, saves, setCartItems, setLikes, setSaves } = useUserStore();
  const { setIsAddReviewOpen } = useAppStore();
  const { user } = useUserStore();
  const [counters, setCounters] = useState({
    carts: product.carts,
    likes: product.likes,
    saves: product.saves,
    reviews: product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews
  });

  const inCart = cartItems.find((item) => item.product === product._id);
  const inLikes = likes.find((item) => item === product._id);
  const inSaves = saves.find((item) => item === product._id);

  const likeHandler = useLike({
    product,
    onClick: (state) => {
      setCounters({ ...counters, likes: counters.likes + (state ? 1 : -1) });
      const temp = [...likes];
      inLikes ? temp.splice(temp.indexOf(inLikes), 1) : temp.push(product._id);
      setLikes([...temp]);
    }
  });

  const saveHandler = useSave({
    product,
    onClick: (state) => {
      setCounters({ ...counters, saves: counters.saves + (state ? 1 : -1) });
      const temp = [...saves];
      inSaves ? temp.splice(temp.indexOf(inSaves), 1) : temp.push(product._id);
      setSaves([...temp]);
    }
  });

  const addToCartHandler = useAddToCart({
    product,
    onSuccess: (state) => {
      setCounters({ ...counters, carts: counters.carts + (state ? 1 : -1) });
      const cartItemsTemp = [...cartItems];
      inCart
        ? cartItemsTemp.splice(cartItemsTemp.indexOf(inCart), 1)
        : cartItemsTemp.push({ product: product._id, quantity: 1 });
      setCartItems([...cartItemsTemp]);
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    }
  });

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("scroll", (emblaApi) => setCaroselImageIndex(emblaApi.selectedScrollSnap()));
    return () => carouselApi.destroy();
  }, [carouselApi]);

  const handleLikeAction = () => likeHandler.handleLike(!inLikes);
  const handleSaveAction = () => saveHandler.handleSave(!inSaves);
  const handleAddToCart = () => addToCartHandler.handleAddToCart(!inCart);

  return (
    <div className="flex w-full flex-col justify-between overflow-hidden rounded-sm border bg-white">
      <div>
        <div className="relative">
          {product.pictures.length > 1 ? (
            <>
              <Carousel className="w-full" dir="ltr" setApi={setCarouselApi}>
                <CarouselContent>
                  {product.pictures.map((img, index) => (
                    <CarouselItem className="relative flex h-44 items-center" key={index}>
                      <Image
                        alt={product.name}
                        className="h-full w-full object-contain"
                        height={150}
                        src={img.imageUrl}
                        width={150}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <CarouselIndecator
                array={product.pictures}
                className="absolute bottom-2 p-4"
                selectedIndex={caroselImageIndex}
                setSelectedIndex={(index) => carouselApi?.scrollTo(index, false)}
              />
            </>
          ) : (
            <Image
              alt="Converse sneakers"
              className="h-44 w-full object-contain"
              height={150}
              src={product.pictures[0].imageUrl}
              width={150}
            />
          )}
        </div>

        <div className="mt-2 flex flex-col gap-1 px-2 sm:px-4">
          <LocalLink className="font-semibold text-gray-800 hover:underline" href={`/product/${product.seName}`}>
            <span title={product.name}>{product.name}</span>
          </LocalLink>
          {product.vendor.name ? (
            <p className="-mt-1 text-sm text-secondary">
              sold by:{" "}
              <LocalLink className="hover:text-primary" href={`/profile/vendor/${product.vendor.seName}`}>
                {product.vendor.name}
              </LocalLink>
            </p>
          ) : null}
          <span className="font-semibold text-gray-800">{product.price.price}$</span>
          <div className="flex items-center">
            <RatingStars
              rate={product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews}
              size={15}
            />
            {user?.isRegistered ? (
              <button
                aria-label="Add review"
                className="px-2 text-lg text-primary"
                onClick={() => setIsAddReviewOpen(true, product._id)}
              >
                <div className="lh-0 h-2">+</div>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex border-t border-gray-200">
        <Button
          aria-label="Add to cart"
          className={`basis-1/3 rounded-none border-e fill-black p-1 ${inCart ? "bg-green-200" : "bg-white"}`}
          isLoading={addToCartHandler.isPending}
          spinnerSize="20"
          onClick={handleAddToCart}
        >
          <div className="flex items-center justify-center gap-1">
            <RiShoppingCartLine size={20} />
            <span className="hidden text-sm sm:inline">{counters.carts}</span>
          </div>
        </Button>
        <Button
          aria-label="like product"
          className={`basis-1/3 rounded-none border-e fill-black p-1 ${inLikes ? "bg-red-200" : "bg-white"}`}
          spinnerSize="20"
          onClick={handleLikeAction}
        >
          <div className="flex items-center justify-center gap-1">
            <RiHeart2Line size={20} />
            <span className="hidden text-sm sm:inline">{counters.likes}</span>
          </div>
        </Button>
        <Button
          aria-label="save product"
          className={`basis-1/3 rounded-none fill-black p-1 ${inSaves ? "bg-yellow-200" : "bg-white"}`}
          spinnerSize="20"
          onClick={handleSaveAction}
        >
          <div className="flex items-center justify-center gap-1">
            <RiBookmark2Line size={20} />
            <span className="hidden text-sm sm:inline">{counters.saves}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
