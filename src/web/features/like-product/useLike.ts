import useAdjustProductsQueries from "@/common/hooks/useAdjustProductsQueries";
import useDebounce from "@/common/hooks/useDebounce";
import { useUserStore } from "@/common/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/common/context/Translation";
import { toast } from "react-toastify";
import { likeProduct, unLikeProduct } from "@/web/services/userActions.service";
import { isAxiosError } from "axios";

interface LikeHookProps {
  productId: string;
  likesCount: number;
  onError?: (shouldLike: boolean) => void;
  onSuccess?: (shouldLike: boolean) => void;
  onClick?: (shouldLike: boolean) => void;
}

export default function useLike({ productId, likesCount, onError, onSuccess, onClick }: LikeHookProps) {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();
  const adjustQueriesCache = useAdjustProductsQueries(productId);

  const handleDataAdjustment = (shouldLike: boolean) => {
    const change = { isLiked: shouldLike, likes: likesCount + (shouldLike ? 1 : -1) };
    adjustQueriesCache(change);
  };

  const likeMutation = useMutation({
    mutationKey: ["like", productId],
    mutationFn: () => likeProduct(productId),
    onSuccess: () => {
      onSuccess?.(true);
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      onError?.(true);
      handleDataAdjustment(false);
    }
  });

  const unlikeMutation = useMutation({
    mutationKey: ["unlike", productId],
    mutationFn: () => unLikeProduct(productId),
    onSuccess: () => {
      onSuccess?.(false);
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      onError?.(false);
      handleDataAdjustment(true);
    }
  });

  const mutateServer = useDebounce((shouldLike: boolean) => {
    if (shouldLike) likeMutation.mutate();
    else unlikeMutation.mutate();
  });

  const handleLike = (shouldLike: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "like" });

    handleDataAdjustment(shouldLike);
    onClick?.(shouldLike);
    mutateServer(shouldLike);
  };

  return handleLike;
}
