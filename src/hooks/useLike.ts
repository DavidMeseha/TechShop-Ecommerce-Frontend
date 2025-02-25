import { queryClient } from "@/components/layout/MainLayout";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { likeProduct, unLikeProduct } from "@/services/userActions.service";

interface LikeHookProps {
  product: IFullProduct;
  onError?: (shouldLike: boolean) => void;
  onClick?: (shouldLike: boolean) => void;
}

export default function useLike({ product, onError, onClick }: LikeHookProps) {
  const user = useUserStore((state) => state.user);
  const removeFromLikes = useUserStore((state) => state.removeFromLikes);
  const addToLikes = useUserStore((state) => state.addToLikes);
  const getLikes = useUserStore((state) => state.getLikes);
  const { t } = useTranslation();

  const likeMutation = useMutation({
    mutationKey: ["like", product.seName],
    mutationFn: () => likeProduct(product._id),
    onSuccess: async () => {
      getLikes();
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onError: () => {
      removeFromLikes(product._id);
      onError?.(true);
    }
  });

  const unlikeMutation = useMutation({
    mutationKey: ["unlike", product.seName],
    mutationFn: () => unLikeProduct(product._id),
    onSuccess: async () => {
      getLikes();
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onError: () => {
      addToLikes(product._id);
      onError?.(false);
    }
  });

  const handleLike = (shouldLike: boolean) => {
    if (likeMutation.isPending || unlikeMutation.isPending) return;
    if (!user) return;

    if (!user.isRegistered) {
      return toast.warn(t("loginToPerformAction"), { toastId: "likeError" });
    }

    shouldLike ? addToLikes(product._id) : removeFromLikes(product._id);
    onClick?.(shouldLike);

    if (shouldLike) {
      likeMutation.mutate();
    } else {
      unlikeMutation.mutate();
    }
  };

  return handleLike;
}
