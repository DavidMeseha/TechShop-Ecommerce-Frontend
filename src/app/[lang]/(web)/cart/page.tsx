"use client";

import CartItem from "@/components/CartItem";
import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useRouter } from "@bprogress/next";
import { LocalLink } from "@/components/LocalizedNavigation";
import { BiLoaderCircle } from "react-icons/bi";
import { useUserStore } from "@/stores/userStore";
import { checkoutData } from "@/services/checkout.service";
import { isInCart } from "@/lib/utils";

export default function Page() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const cartItems = useUserStore((state) => state.cartItems);
  const router = useRouter();

  const checkoutQuery = useQuery({
    queryKey: ["cartItems"],
    queryFn: () => checkoutData()
  });

  const products = checkoutQuery.data?.cartItems ?? [];
  const total = checkoutQuery.data?.total ?? 0;

  if (cartItems.length > 0)
    return (
      <>
        <div className="sticky z-20 flex items-center justify-between border-b bg-white pb-2 pt-2 md:top-[60px] md:mx-0">
          <h1 className="hidden text-3xl font-bold md:block">{t("yourCart")}</h1>
          <Button
            className="mx-4 block w-full rounded-md bg-primary font-semibold text-white md:mx-0 md:w-auto"
            isLoading={checkoutQuery.isFetching}
            onClick={() => (user?.isRegistered ? router.push("/user/checkout") : router.push("/login"))}
          >
            <div className="flex w-full justify-between gap-8">
              <div>
                {t("checkout")}({cartItems.length})
              </div>
              <div>{total}$</div>
            </div>
          </Button>
        </div>

        {products.map((item) => (
          <CartItem
            attributes={item.attributes}
            canEdit
            isInCart={isInCart(item.product._id, cartItems)}
            key={item.product.seName}
            product={item.product}
            quantity={item.quantity}
          />
        ))}
      </>
    );

  if (checkoutQuery.isFetching)
    return (
      <div className="flex justify-center pt-40">
        <BiLoaderCircle className="animate-spin fill-primary" size={50} />
      </div>
    );

  return (
    <div className="mt-44 flex flex-col items-center justify-center gap-2">
      <div className="text-2xl font-bold">{t("cart.empty")}</div>
      <LocalLink className="bg-primary px-4 py-2 font-bold text-white" href="/">
        {t("cart.shopNow")}
      </LocalLink>
    </div>
  );
}
