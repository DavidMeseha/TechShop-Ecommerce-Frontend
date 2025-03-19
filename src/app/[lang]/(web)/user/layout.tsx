"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { useOverlayStore } from "@/stores/overlayStore";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";

type Props = {
  children: React.ReactNode;
};

export default function ProfileLayout({ children }: Props) {
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();

  useEffect(() => {
    if (user && !user.isRegistered) setIsLoginOpen(true);
  }, []);

  if (user?.isRegistered) return <div className="md:mt-0">{children}</div>;

  if (user)
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

  return <LoadingSpinner />;
}
