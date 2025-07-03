"use client";

import { useTranslation } from "@/common/context/Translation";
import { useUserStore } from "@/web/stores/userStore";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import UserProductsSection from "./sections/UserProductsSection";
import UserMainInfoSection from "./sections/UserMainInfoSection";

export default function ProfilePage() {
  const cartItems = useUserStore((state) => state.cartItems);
  const { t } = useTranslation();

  return (
    <div className="relative pt-4">
      <LocalLink
        className="absolute end-4 top-4 rounded-sm bg-primary px-4 py-2 text-xs text-white md:end-0 md:text-base"
        href="/cart"
      >
        {t("checkout")} ({cartItems.length})
      </LocalLink>

      <UserMainInfoSection />
      <UserProductsSection />
    </div>
  );
}
