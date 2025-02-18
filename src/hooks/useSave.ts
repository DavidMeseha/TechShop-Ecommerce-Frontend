import { useUserStore } from "@/stores/userStore";
import { IFullProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import { saveProduct, unsaveProduct } from "@/services/userActions.service";

interface SaveHookProps {
  product: IFullProduct;
  onError?: (saved: boolean) => void;
  onClick?: (saved: boolean) => void;
}

export default function useSave({ product, onError, onClick }: SaveHookProps) {
  const { setSaves, user } = useUserStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const saveMutation = useMutation({
    mutationKey: ["save", product.seName],
    mutationFn: () => saveProduct(product._id),
    onSuccess: async () => {
      setSaves();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: () => onError?.(true)
  });

  const unsaveMutation = useMutation({
    mutationKey: ["unsave", product.seName],
    mutationFn: () => unsaveProduct(product._id),
    onSuccess: async () => {
      setSaves();
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
    },
    onError: () => onError?.(false)
  });

  const handleSave = async (shouldSave: boolean) => {
    if (!user) return;
    if (!user.isRegistered) {
      return toast.warn(t("loginToPerformAction"), { toastId: "saveError" });
    }
    if (saveMutation.isPending || unsaveMutation.isPending) return;

    onClick?.(shouldSave);

    if (shouldSave) {
      await saveMutation.mutateAsync();
    } else {
      await unsaveMutation.mutateAsync();
    }
  };

  return { handleSave };
}
