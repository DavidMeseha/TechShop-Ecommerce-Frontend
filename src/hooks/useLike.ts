import { queryClient } from "@/components/layout/MainLayout";
import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { likeProduct, unLikeProduct } from "@/services/userActions.service";

interface LikeHookProps {
  product: IFullProduct;
  onError?: (liked: boolean) => void;
  onClick?: (liked: boolean) => void;
}

export default function useLike({ product, onError, onClick }: LikeHookProps) {
  const { setLikes, user } = useUserStore();
  const { t } = useTranslation();

  const likeMutation = useMutation({
    mutationKey: ["like", product.seName],
    mutationFn: () => likeProduct(product._id),
    onSuccess: async () => {
      setLikes();
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onError: () => onError?.(true)
  });

  const unlikeMutation = useMutation({
    mutationKey: ["unlike", product.seName],
    mutationFn: () => unLikeProduct(product._id),
    onSuccess: async () => {
      setLikes();
      queryClient.invalidateQueries({ queryKey: ["likedProducts"] });
    },
    onError: () => onError?.(false)
  });

  const handleLike = (shouldLike: boolean) => {
    if (likeMutation.isPending || unlikeMutation.isPending) return;
    if (!user) return;

    if (!user.isRegistered) {
      return toast.warn(t("loginToPerformAction"), { toastId: "likeError" });
    }

    onClick?.(shouldLike);

    if (shouldLike) {
      likeMutation.mutate();
    } else {
      unlikeMutation.mutate();
    }
  };

  return { handleLike };
}
