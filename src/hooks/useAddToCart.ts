import { queryClient } from "@/components/layout/MainLayout";
import { addToCart, removeFromCart } from "@/services/userActions.service";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct, IProductAttribute } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

interface CartHookProps {
  product: IFullProduct;
  onSuccess?: (added: boolean) => void;
}

interface CartMutationProps {
  attributes: IProductAttribute[];
  quantity: number;
}

export default function useAddToCart({ product, onSuccess }: CartHookProps) {
  const { setCartItems, user } = useUserStore();
  const { setIsProductAttributesOpen } = useAppStore();

  const addToCartMutation = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: ({ attributes, quantity }: CartMutationProps) => addToCart(product._id, attributes, quantity),
    onSuccess: () => {
      setCartItems();
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      onSuccess?.(true);
    }
  });

  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product.seName],
    mutationFn: () => removeFromCart(product._id),
    onSuccess: () => {
      setCartItems();
      queryClient.invalidateQueries({ queryKey: ["cartProducts"] });
      onSuccess?.(false);
    }
  });

  // Helper function to handle product attributes
  const handleProductAttributes = useCallback(
    (quantity: number) => {
      setIsProductAttributesOpen(true, product._id, "Add To Cart", (attributes) =>
        addToCartMutation.mutate({ attributes, quantity })
      );
    },
    [product._id, addToCartMutation, setIsProductAttributesOpen]
  );

  // Main handler function
  const handleAddToCart = (addToCart: boolean, attributes?: IProductAttribute[], quantity: number = 1) => {
    if (!user) return;
    if (addToCartMutation.isPending || removeFromCartMutation.isPending) return;

    if (addToCart) {
      if (!attributes) {
        return handleProductAttributes(quantity);
      }
      return addToCartMutation.mutate({ attributes, quantity });
    }

    removeFromCartMutation.mutate();
  };

  const isPending = addToCartMutation.isPending || removeFromCartMutation.isPending;

  return { handleAddToCart, isPending };
}
