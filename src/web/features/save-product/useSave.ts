import useAdjustProductsQueries from "@/common/hooks/useAdjustProductsQueries";
import useDebounce from "@/common/hooks/useDebounce";
import { useUserStore } from "@/web/stores/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/common/context/Translation";
import { toast } from "react-toastify";
import { saveProduct, unsaveProduct } from "@/web/services/userActions.service";
import { isAxiosError } from "axios";
import { SAVED_PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";

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

  const mutateServer = useDebounce((shouldSave: boolean) => {
    if (shouldSave) saveMutation.mutate();
    else unsaveMutation.mutate();
  });

  const handleSave = async (shouldSave: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "save" });

    handleDataAdjustment(shouldSave);
    onClick?.(shouldSave);
    mutateServer(shouldSave);
  };

  return handleSave;
}
