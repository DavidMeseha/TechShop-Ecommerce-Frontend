import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { followVendor, unfollowVendor } from "@/services/userActions.service";
import { queryClient } from "@/components/layout/MainLayout";

interface FollowHookProps {
  vendor: IVendor;
  onClick?: (followed: boolean) => void;
}

export default function useFollow({ vendor, onClick }: FollowHookProps) {
  const { setFollowedVendors, user } = useUserStore();
  const { t } = useTranslation();

  const followMutation = useMutation({
    mutationKey: ["follow", vendor._id],
    mutationFn: () => followVendor(vendor._id),
    onSuccess: async () => {
      setFollowedVendors();
      queryClient.invalidateQueries({ queryKey: ["following"] });
    }
  });

  const unfollowMutation = useMutation({
    mutationKey: ["unfollow", vendor._id],
    mutationFn: () => unfollowVendor(vendor._id),
    onSuccess: async () => {
      setFollowedVendors();
      queryClient.invalidateQueries({ queryKey: ["following"] });
    }
  });

  const handleFollow = async (shouldFollow: boolean) => {
    if (followMutation.isPending || unfollowMutation.isPending) return;
    if (!user) return;
    if (!user.isRegistered) {
      return toast.warn(t("loginToPerformAction"));
    }

    onClick?.(shouldFollow);

    if (shouldFollow) {
      await followMutation.mutateAsync();
    } else {
      await unfollowMutation.mutateAsync();
    }
  };

  return { handleFollow };
}
