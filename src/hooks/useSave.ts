import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { saveProduct, unsaveProduct } from "@/services/userActions.service";

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

  const saveMutation = useMutation({
    mutationKey: ["save", product.seName],
    mutationFn: () => saveProduct(product._id),
    onSuccess: async () => {
      getSaves();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: () => {
      removeFromSaves(product._id);
      onError?.(true);
    }
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product.seName],
    mutationFn: () => unsaveProduct(product._id),
    onSuccess: async () => {
      getSaves();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: () => {
      addToSaves(product._id);
      onError?.(false);
    }
  });

  const handleSave = async (shouldSave: boolean) => {
    if (!user) return;
    if (!user.isRegistered) {
      return toast.warn(t("loginToPerformAction"), { toastId: "saveError" });
    }
    if (saveMutation.isPending || unsaveMutation.isPending) return;

    shouldSave ? addToSaves(product._id) : removeFromSaves(product._id);
    onClick?.(shouldSave);

    if (shouldSave) {
      await saveMutation.mutateAsync();
    } else {
      await unsaveMutation.mutateAsync();
    }
  };

  return handleSave;
}
