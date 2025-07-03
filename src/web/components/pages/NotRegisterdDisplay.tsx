"use client";

import { useTranslation } from "@/common/context/Translation";
import React, { useEffect } from "react";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useOverlayStore } from "@/common/stores/overlayStore";
import { useUserStore } from "@/common/stores/userStore";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";

export default function NotRegisterd({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);
  const { t } = useTranslation();

  useEffect(() => {
    if (user && !user?.isRegistered) setIsLoginOpen(true);
  }, [user]);

  if (!user) return <LoadingSpinner />;
  if (user.isRegistered) return children;

  return (
    <div className="mt-44 flex justify-center">
      <p className="text-lg font-semibold">
        {t("profile.youNeedTo")}
        <span className="text-primary">
          <SubmitButton onClick={() => setIsLoginOpen(true)}>{t("profile.signUp")}</SubmitButton>
        </span>
      </p>
    </div>
  );
}
