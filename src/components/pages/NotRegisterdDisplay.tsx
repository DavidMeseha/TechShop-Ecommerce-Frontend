"use client";

import { useTranslation } from "@/context/Translation";
import React, { useEffect } from "react";
import Button from "../ui/Button";
import { useOverlayStore } from "@/stores/overlayStore";
import { useUserStore } from "@/stores/userStore";
import LoadingSpinner from "../LoadingUi/LoadingSpinner";

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
          <Button onClick={() => setIsLoginOpen(true)}>{t("profile.signUp")}</Button>
        </span>
      </p>
    </div>
  );
}
