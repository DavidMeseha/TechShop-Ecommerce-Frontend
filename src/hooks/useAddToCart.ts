import { addToCart, removeFromCart } from "@/services/userActions.service";
import { useProductStore } from "@/stores/productStore";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct, IProductAttribute } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import useAdjustProductsQueries from "./useAdjustProductsQueries";
import { CART_QUERY_KEY } from "@/constants/query-keys";

export type IAddToCartProduct = Pick<IFullProduct, "_id" | "name" | "productAttributes" | "seName" | "hasAttributes">;
interface CartHookProps {
  product: IFullProduct;
  onSuccess?: (added: boolean) => void;
}

interface CartMutationProps {
  attributes: IProductAttribute[];
  quantity: number;
}

export default function useAddToCart({ product, onSuccess }: CartHookProps) {
  const user = useUserStore((state) => state.user);
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setIsProductAttributesOpen = useProductStore((state) => state.setIsProductAttributesOpen);
  const queryClient = useQueryClient();

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
      handleDataAdjustment(true);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(CART_QUERY_KEY)
      });
    },
    onError: (error) => {
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

  // Helper function to handle product attributes
  const handleProductAttributes = (quantity: number, attributes?: IProductAttribute[]) => {
    if (!attributes)
      return setIsProductAttributesOpen(true, product.seName, (attributes) =>
        addToCartMutation.mutate({ attributes, quantity })
      );

    addToCartMutation.mutate({ attributes, quantity });
  };

  // Main handler function
  const handleAddToCart = (shouldAdd: boolean, selectedAttributes?: IProductAttribute[], quantity: number = 1) => {
    if (!user) return;
    if (addToCartMutation.isPending || removeFromCartMutation.isPending) return;

    if (shouldAdd) {
      if (product.hasAttributes) return handleProductAttributes(quantity, selectedAttributes);
      return addToCartMutation.mutate({ attributes: [], quantity });
    }

    removeFromCartMutation.mutate();
  };

  const isPending = addToCartMutation.isPending || removeFromCartMutation.isPending;

  return { handleAddToCart, isPending };
}
