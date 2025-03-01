import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { followVendor, unfollowVendor } from "@/services/userActions.service";
import { isAxiosError } from "axios";
import { useRef } from "react";

interface FollowHookProps {
  vendor: IVendor;
  onClick?: (followed: boolean) => void;
}

export default function useFollow({ vendor, onClick }: FollowHookProps) {
  const getFollowedVendors = useUserStore((state) => state.getFollowedVendors);
  const removeFromFollowedVendors = useUserStore((state) => state.removeFromFollowedVendors);
  const addToFollowedVendors = useUserStore((state) => state.addToFollowedVendors);
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const timeoutRef = useRef<number>();

  const followMutation = useMutation({
    mutationKey: ["follow", vendor._id],
    mutationFn: () => followVendor(vendor._id),
    onSuccess: async () => {
      getFollowedVendors();
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status !== 400) {
        removeFromFollowedVendors(vendor._id);
      }
    }
  });

  const unfollowMutation = useMutation({
    mutationKey: ["unfollow", vendor._id],
    mutationFn: () => unfollowVendor(vendor._id),
    onSuccess: async () => {
      getFollowedVendors();
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status !== 400) {
        addToFollowedVendors(vendor._id);
      }
    }
  });

  const handleFollow = async (shouldFollow: boolean) => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn(t("loginToPerformAction"));

    // Immediately update UI
    shouldFollow ? addToFollowedVendors(vendor._id) : removeFromFollowedVendors(vendor._id);
    onClick?.(shouldFollow);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (shouldFollow) followMutation.mutate();
      else unfollowMutation.mutate();
    }, 600);
  };

  return handleFollow;
}
