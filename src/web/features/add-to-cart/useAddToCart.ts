import { useProductStore } from "@/common/stores/productStore";
import { useUserStore } from "@/common/stores/userStore";
import { ICustomeProductAttribute, IFullProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import useAdjustProductsQueries from "@/common/hooks/useAdjustProductsQueries";
import { CART_QUERY_KEY } from "@/common/constants/query-keys";
import { toast } from "react-toastify";
import { useTranslation } from "@/common/context/Translation";
import { addToCart, removeFromCart } from "@/web/services/userActions.service";

export type IAddToCartProduct = Pick<IFullProduct, "_id" | "name" | "productAttributes" | "seName" | "hasAttributes">;
interface CartHookProps {
  product: Pick<IFullProduct, "carts" | "_id" | "seName">;
  onSuccess?: (added: boolean) => void;
}

interface CartMutationProps {
  attributes: ICustomeProductAttribute[];
  quantity: number;
}

export default function useAddToCart({ product, onSuccess }: CartHookProps) {
  const user = useUserStore((state) => state.user);
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setIsProductAttributesOpen = useProductStore((state) => state.setIsProductAttributesOpen);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const adjustQueriesCache = useAdjustProductsQueries(product._id);

  const handleDataAdjustment = (shouldLike: boolean) => {
    const change: Partial<IFullProduct> = { isInCart: shouldLike, carts: product.carts + (shouldLike ? 1 : -1) };
    adjustQueriesCache(change);
  };

  const addToCartMutation = useMutation({
    mutationKey: ["addToCart", product.seName],
    mutationFn: ({ attributes, quantity }: CartMutationProps) => addToCart(product._id, attributes, quantity),
    onSuccess: () => {
      getCartItems();
      onSuccess?.(true);
      handleDataAdjustment(true);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(CART_QUERY_KEY)
      });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) toast.error(t("cartMaxSizeError"));
      if (isAxiosError(error) && error.response?.status === 409) {
        handleDataAdjustment(true);
        return onSuccess?.(false);
      }
      handleDataAdjustment(false);
    }
  });

  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product.seName],
    mutationFn: () => removeFromCart(product._id),
    onSuccess: () => {
      onSuccess?.(false);
      handleDataAdjustment(false);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(CART_QUERY_KEY)
      });
      getCartItems();
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        handleDataAdjustment(false);
        return onSuccess?.(false);
      }
      handleDataAdjustment(true);
    }
  });

  const handleProductAttributes = (quantity?: number, attributes?: ICustomeProductAttribute[]) => {
    if (attributes && quantity) return addToCartMutation.mutate({ attributes, quantity });

    setIsProductAttributesOpen(true, product.seName, (attributes, quantity) =>
      addToCartMutation.mutate({ attributes, quantity })
    );
  };

  const handleAddToCart = (shouldAdd: boolean, quantity?: number, selectedAttributes?: ICustomeProductAttribute[]) => {
    if (!user) return;
    if (addToCartMutation.isPending || removeFromCartMutation.isPending) return;

    if (shouldAdd) return handleProductAttributes(quantity, selectedAttributes);
    removeFromCartMutation.mutate();
  };

  const isPending = addToCartMutation.isPending || removeFromCartMutation.isPending;

  return { handleAddToCart, isPending };
}
