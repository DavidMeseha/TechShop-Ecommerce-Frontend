import useAdjustVendorsQueries from "@/common/hooks/useAdjustVendorsQueries";
import useDebounce from "@/common/hooks/useDebounce";
import { useTranslation } from "@/common/context/Translation";
import { useUserStore } from "@/common/stores/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { followVendor, unfollowVendor } from "@/web/services/userActions.service";
import { isAxiosError } from "axios";
import { FOLLOWING_QUERY_KEY } from "@/common/constants/query-keys";
import { IVendor } from "@/types";

interface FollowHookProps {
  vendor: IVendor;
  onClick?: (shouldFollow: boolean) => void;
  onError?: (shouldFollow: boolean) => void;
}

export default function useFollow({ vendor, onClick, onError }: FollowHookProps) {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { adjustVendorsQueries, adjustProductsQueries } = useAdjustVendorsQueries(vendor._id);

  const handleDataAdjustment = (shouldFollow: boolean) => {
    const change: Partial<IVendor> = {
      isFollowed: shouldFollow,
      followersCount: vendor.followersCount + (shouldFollow ? 1 : -1)
    };
    adjustProductsQueries(change);
    adjustVendorsQueries(change);
  };

  const followMutation = useMutation({
    mutationKey: ["follow", vendor._id],
    mutationFn: () => followVendor(vendor._id),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [FOLLOWING_QUERY_KEY] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      handleDataAdjustment(false);
      onError?.(true);
    }
  });

  const unfollowMutation = useMutation({
    mutationKey: ["unfollow", vendor._id],
    mutationFn: () => unfollowVendor(vendor._id),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [FOLLOWING_QUERY_KEY] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      handleDataAdjustment(true);
      onError?.(false);
    }
  });

  const mutateServer = useDebounce((shouldFollow: boolean) => {
    if (shouldFollow) followMutation.mutate();
    else unfollowMutation.mutate();
  });

  const handleFollow = async (shouldFollow: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"), { toastId: "follow" });

    handleDataAdjustment(shouldFollow);
    onClick?.(shouldFollow);

    mutateServer(shouldFollow);
  };

  return handleFollow;
}
