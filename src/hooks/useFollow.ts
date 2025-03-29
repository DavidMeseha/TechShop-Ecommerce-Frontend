import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { followVendor, unfollowVendor } from "@/services/userActions.service";
import { isAxiosError } from "axios";
import { useRef } from "react";
import useAdjustVendorsQueries from "./useAdjustVendorsQueries";

interface FollowHookProps {
  vendor: IVendor;
  onClick?: (shouldFollow: boolean) => void;
  onError?: (shouldFollow: boolean) => void;
}

export default function useFollow({ vendor, onClick, onError }: FollowHookProps) {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const timeoutRef = useRef<number>();
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
      queryClient.invalidateQueries({ queryKey: ["following"] });
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
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) return;
      handleDataAdjustment(true);
      onError?.(false);
    }
  });

  const handleFollow = async (shouldFollow: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"));

    handleDataAdjustment(shouldFollow);
    onClick?.(shouldFollow);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldFollow) followMutation.mutate();
      else unfollowMutation.mutate();
    }, 600);
  };

  return handleFollow;
}
