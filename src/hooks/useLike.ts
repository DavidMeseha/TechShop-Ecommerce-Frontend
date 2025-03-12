import { useUserStore } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { likeProduct, unLikeProduct } from "@/services/userActions.service";
import { useRef } from "react";
import { isAxiosError } from "axios";

interface LikeHookProps {
  productId: string;
  onError?: (shouldLike: boolean) => void;
  onSuccess?: (shouldLike: boolean) => void;
  onClick?: (shouldLike: boolean) => void;
}

export default function useLike({ productId, onError, onSuccess, onClick }: LikeHookProps) {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();
  const timeoutRef = useRef<number>();

  const likeMutation = useMutation({
    mutationKey: ["like", productId],
    mutationFn: () => likeProduct(productId),
    onSuccess: () => onSuccess?.(true),
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      onError?.(true);
    }
  });

  const unlikeMutation = useMutation({
    mutationKey: ["unlike", productId],
    mutationFn: () => unLikeProduct(productId),
    onSuccess: () => onSuccess?.(false),
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      onError?.(false);
    }
  });

  const handleLike = (shouldLike: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "likeError" });

    onClick?.(shouldLike);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldLike) likeMutation.mutate();
      else unlikeMutation.mutate();
    }, 600);
  };

  return handleLike;
}
