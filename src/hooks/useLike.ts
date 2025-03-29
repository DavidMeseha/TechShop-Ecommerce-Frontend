import { useUserStore } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { likeProduct, unLikeProduct } from "@/services/userActions.service";
import { useRef } from "react";
import { isAxiosError } from "axios";
import useAdjustProductsQueries from "./useAdjustProductsQueries";

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
  const timeoutRef = useRef<number>();
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

  const handleLike = (shouldLike: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "likeError" });

    handleDataAdjustment(shouldLike);
    onClick?.(shouldLike);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldLike) likeMutation.mutate();
      else unlikeMutation.mutate();
    }, 600);
  };

  return handleLike;
}
