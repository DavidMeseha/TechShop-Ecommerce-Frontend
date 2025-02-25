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
  const getFollowedVendors = useUserStore((state) => state.getFollowedVendors);
  const removeFromFollowedVendors = useUserStore((state) => state.removeFromFollowedVendors);
  const addToFollowedVendors = useUserStore((state) => state.addToFollowedVendors);
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();

  const followMutation = useMutation({
    mutationKey: ["follow", vendor._id],
    mutationFn: () => followVendor(vendor._id),
    onSuccess: async () => {
      getFollowedVendors();
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: () => removeFromFollowedVendors(vendor._id)
  });

  const unfollowMutation = useMutation({
    mutationKey: ["unfollow", vendor._id],
    mutationFn: () => unfollowVendor(vendor._id),
    onSuccess: async () => {
      getFollowedVendors();
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
    onError: () => addToFollowedVendors(vendor._id)
  });

  const handleFollow = async (shouldFollow: boolean) => {
    if (followMutation.isPending || unfollowMutation.isPending) return;
    if (!user) return;
    if (!user.isRegistered) {
      return toast.warn(t("loginToPerformAction"));
    }

    shouldFollow ? addToFollowedVendors(vendor._id) : removeFromFollowedVendors(vendor._id);
    onClick?.(shouldFollow);

    if (shouldFollow) {
      await followMutation.mutateAsync();
    } else {
      await unfollowMutation.mutateAsync();
    }
  };

  return handleFollow;
}
