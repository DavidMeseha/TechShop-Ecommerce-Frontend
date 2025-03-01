import { addToCart, removeFromCart } from "@/services/userActions.service";
import { useProductStore } from "@/stores/productStore";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct, IProductAttribute } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const addProductToCart = useUserStore((state) => state.addToCart);
  const removeProductFromCart = useUserStore((state) => state.removeFromCart);
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setIsProductAttributesOpen = useProductStore((state) => state.setIsProductAttributesOpen);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationKey: ["addToCart", product.seName],
    mutationFn: ({ attributes, quantity }: CartMutationProps) => addToCart(product._id, attributes, quantity),
    onSuccess: () => {
      addProductToCart(product._id);
      getCartItems();
      queryClient.invalidateQueries({ queryKey: ["checkoutItems"] });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      onSuccess?.(true);
    }
  });

  const removeFromCartMutation = useMutation({
    mutationKey: ["removeFromCart", product.seName],
    mutationFn: () => removeFromCart(product._id),
    onSuccess: () => {
      removeProductFromCart(product._id);
      getCartItems();
      queryClient.invalidateQueries({ queryKey: ["checkoutItems"] });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      onSuccess?.(false);
    },
    onError: () => getCartItems()
  });

  // Helper function to handle product attributes
  const handleProductAttributes = (quantity: number, attributes?: IProductAttribute[]) => {
    if (!attributes)
      return setIsProductAttributesOpen(true, product._id, (attributes) =>
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
