"use client";

import { BsCartFill } from "react-icons/bs";
import { useUserStore } from "@/stores/userStore";
import { LocalLink } from "@/components/LocalizedNavigation";
import { useRouter } from "next-nprogress-bar";
import BackArrow from "@/components/ui/BackArrow";
import { useTranslation } from "@/context/Translation";
import UserProfileDisplay from "./UserProfileDisplay";

export default function UserProfilePage() {
  const { t } = useTranslation();
  const { user, cartItems } = useUserStore();
  const router = useRouter();

  if (user && user.isRegistered) return <UserProfileDisplay />;

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-20 w-full border bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">{t("profile.yourProfile")}</h1>
          <LocalLink className="relative end-2" href="/cart">
            <div className="absolute -end-2 -top-1 flex h-4 w-4 justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {cartItems.length}
            </div>
            <BsCartFill size={20} />
          </LocalLink>
        </div>
      </div>
      <div className="mt-44 flex justify-center">
        <p className="text-lg font-semibold">
          {t("profile.youNeedTo") + " "}
          <span className="text-primary">
            <LocalLink href="/login">{t("profile.signUp")}</LocalLink>
          </span>
        </p>
      </div>
    </>
  );
}
