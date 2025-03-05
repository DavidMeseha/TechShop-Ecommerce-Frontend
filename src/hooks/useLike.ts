import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { likeProduct, unLikeProduct } from "@/services/userActions.service";
import { useRef } from "react";
import { isAxiosError } from "axios";

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
  const timeoutRef = useRef<number>();

  const likeMutation = useMutation({
    mutationKey: ["like", product.seName],
    mutationFn: () => likeProduct(product._id),
    onSuccess: async () => {
      getLikes();
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status !== 400) {
        removeFromLikes(product._id);
        onError?.(true);
      }
    }
  });

  const unlikeMutation = useMutation({
    mutationKey: ["unlike", product.seName],
    mutationFn: () => unLikeProduct(product._id),
    onSuccess: async () => {
      getLikes();
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status !== 400) {
        addToLikes(product._id);
        onError?.(false);
      }
    }
  });

  const handleLike = (shouldLike: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "likeError" });

    // Immediately update UI
    shouldLike ? addToLikes(product._id) : removeFromLikes(product._id);
    onClick?.(shouldLike);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldLike) likeMutation.mutate();
      else unlikeMutation.mutate();
    }, 600);
  };

  return handleLike;
}
