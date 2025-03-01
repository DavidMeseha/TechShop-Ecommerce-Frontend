import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { saveProduct, unsaveProduct } from "@/services/userActions.service";
import { useRef } from "react";
import { isAxiosError } from "axios";

interface SaveHookProps {
  product: IFullProduct;
  onError?: (shouldSave: boolean) => void;
  onClick?: (shouldSave: boolean) => void;
}

export default function useSave({ product, onError, onClick }: SaveHookProps) {
  const user = useUserStore((state) => state.user);
  const addToSaves = useUserStore((state) => state.addToSaves);
  const removeFromSaves = useUserStore((state) => state.removeFromSaves);
  const getSaves = useUserStore((state) => state.getSaves);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const timeoutRef = useRef<number>();

  const saveMutation = useMutation({
    mutationKey: ["save", product.seName],
    mutationFn: () => saveProduct(product._id),
    onSuccess: async () => {
      getSaves();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status !== 400) {
        removeFromSaves(product._id);
        onError?.(true);
      }
    }
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product.seName],
    mutationFn: () => unsaveProduct(product._id),
    onSuccess: async () => {
      getSaves();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status !== 400) {
        addToSaves(product._id);
        onError?.(false);
      }
    }
  });

  const handleSave = async (shouldSave: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "saveError" });

    shouldSave ? addToSaves(product._id) : removeFromSaves(product._id);
    onClick?.(shouldSave);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldSave) saveMutation.mutate();
      else unsaveMutation.mutate();
    }, 600);
  };

  return handleSave;
}
