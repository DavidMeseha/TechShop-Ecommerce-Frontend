"use client";

import CartItem from "@/components/CartItem";
import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useRouter } from "@bprogress/next";
import { LocalLink } from "@/components/util/LocalizedNavigation";
import { useUserStore } from "@/stores/userStore";
import { CART_QUERY_KEY, CHECKOUT_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import { checkoutData } from "@/services/checkout.service";
import ListItemBlockLoading from "@/components/LoadingUi/ListItemBlockLoading";

export default function CheckoutCartPage() {
  const user = useUserStore((state) => state.user);
  const cartItems = useUserStore((state) => state.cartItems);
  const { t } = useTranslation();
  const router = useRouter();

  const checkoutQuery = useQuery({
    queryKey: [USER_QUERY_KEY, CART_QUERY_KEY, CHECKOUT_QUERY_KEY],
    queryFn: () => checkoutData()
  });

  const products = checkoutQuery.data?.cartItems ?? [];
  const total = checkoutQuery.data?.total ?? 0;
  const errors = checkoutQuery.data?.errors ?? [];
  const isError = errors.length > 0;

  const handleCheckoutClick = () => {
    if (errors.length > 0) return;
    if (user?.isRegistered) router.push("/user/checkout");
    else router.push("/login");
  };

  if (!checkoutQuery.isPending && products.length === 0)
    return (
      <div className="mt-44 flex flex-col items-center justify-center gap-2">
        <div className="text-2xl font-bold">{t("cart.empty")}</div>
        <LocalLink className="bg-primary px-4 py-2 font-bold text-white" href="/">
          {t("cart.shopNow")}
        </LocalLink>
      </div>
    );

  return (
    <div className="mx-2 sm:mx-auto">
      <div className="sticky z-20 flex items-center justify-between border-b bg-white py-2 md:top-[60px]">
        <h1 className="hidden text-3xl font-bold md:block">{t("yourCart")}</h1>
        <Button
          className={`block w-full rounded-md bg-primary font-semibold text-white md:mx-0 md:w-auto ${isError ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={isError}
          isLoading={checkoutQuery.isFetching}
          onClick={handleCheckoutClick}
        >
          <div className="flex w-full justify-between gap-8">
            <div>
              {t("checkout")}({cartItems.length})
            </div>
            <div>{total}$</div>
          </div>
        </Button>
      </div>

      {isError && (
        <div className="my-2 rounded-lg bg-red-200 px-4 py-2 text-center text-xs text-red-600">
          {t("checkoutCartAvilabilityError")}
        </div>
      )}

      {checkoutQuery.isPending && (
        <div className="space-y-4">
          <ListItemBlockLoading height={72} />
          <ListItemBlockLoading height={72} />
          <ListItemBlockLoading height={72} />
        </div>
      )}

      {products.map((item) => (
        <CartItem
          attributes={item.attributes}
          canEdit
          className={errors.find((err) => err.productId === item.product._id) ? "border-red-600" : ""}
          key={item.product.seName}
          product={item.product}
          quantity={item.quantity}
        />
      ))}
    </div>
  );
}
