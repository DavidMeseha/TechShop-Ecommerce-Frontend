import { useUserStore } from "@/stores/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { saveProduct, unsaveProduct } from "@/services/userActions.service";
import { useRef } from "react";
import { isAxiosError } from "axios";
import tempActions from "@/stores/tempActionsCache";

interface SaveHookProps {
  productId: string;
  onError?: (shouldSave: boolean) => void;
  onSuccess?: (shouldLike: boolean) => void;
  onClick?: (shouldSave: boolean) => void;
}

export default function useSave({ productId, onError, onClick, onSuccess }: SaveHookProps) {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const timeoutRef = useRef<number>();

  const saveMutation = useMutation({
    mutationKey: ["save", productId],
    mutationFn: () => saveProduct(productId),
    onSuccess: () => {
      onSuccess?.(true);
      tempActions.set("saves", productId, true);
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      onError?.(true);
    }
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", productId],
    mutationFn: () => unsaveProduct(productId),
    onSuccess: () => {
      onSuccess?.(false);
      tempActions.set("saves", productId, false);
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      onError?.(false);
    }
  });

  const handleSave = async (shouldSave: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "saveError" });

    onClick?.(shouldSave);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldSave) saveMutation.mutate();
      else unsaveMutation.mutate();
    }, 600);
  };

  return handleSave;
}
