"use client";

import { useUserStore } from "@/stores/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { saveProduct, unsaveProduct } from "@/services/userActions.service";
import { useRef } from "react";
import { isAxiosError } from "axios";
import useAdjustProductsQueries from "../../hooks/useAdjustProductsQueries";
import { SAVED_PRODUCTS_QUERY_KEY } from "@/constants/query-keys";

interface SaveHookProps {
  productId: string;
  savesCount: number;
  onError?: (shouldSave: boolean) => void;
  onSuccess?: (shouldSave: boolean) => void;
  onClick?: (shouldSave: boolean) => void;
}

export default function useSave({ productId, savesCount, onError, onClick, onSuccess }: SaveHookProps) {
  const user = useUserStore((state) => state.user);
  const adjustQueriesCache = useAdjustProductsQueries(productId);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const timeoutRef = useRef<number>(null);

  const handleDataAdjustment = (shouldSave: boolean) => {
    const change = { isSaved: shouldSave, saves: savesCount + (shouldSave ? 1 : -1) };
    adjustQueriesCache(change);
  };

  const saveMutation = useMutation({
    mutationKey: ["save", productId],
    mutationFn: () => saveProduct(productId),
    onSuccess: () => {
      onSuccess?.(true);
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes(SAVED_PRODUCTS_QUERY_KEY)
      });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 400)
        toast.error(t("savesMaxSizeError"), { toastId: "save-error" });
      if (isAxiosError(err) && err.response?.status === 409) return;
      handleDataAdjustment(false);
      onError?.(true);
    }
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", productId],
    mutationFn: () => unsaveProduct(productId),
    onSuccess: () => {
      onSuccess?.(false);
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes(SAVED_PRODUCTS_QUERY_KEY)
      });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      handleDataAdjustment(true);
      onError?.(false);
    }
  });

  const handleSave = async (shouldSave: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "save" });

    handleDataAdjustment(shouldSave);
    onClick?.(shouldSave);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldSave) saveMutation.mutate();
      else unsaveMutation.mutate();
    }, 600);
  };

  return handleSave;
}
