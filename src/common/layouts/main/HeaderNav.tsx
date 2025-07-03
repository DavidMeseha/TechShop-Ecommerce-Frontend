import { useUserStore } from "@/common/stores/userStore";
import React, { useMemo } from "react";
import { AppRoutes, LocalLink, useLocalPathname } from "@/common/components/utils/LocalizedNavigation";
import { useTranslation } from "@/common/context/Translation";
import mainNavItems from "@/common/constants/main-nav";
import DropdownButton from "@/common/components/ui/extend/DropdownButton";
import { useRouter } from "@bprogress/next";

export default function HeaderNav() {
  const { t, lang } = useTranslation();
  const { pathname } = useLocalPathname();
  const cartItems = useUserStore((state) => state.cartItems);
  const router = useRouter();

  const menu = useMemo(() => mainNavItems(t, cartItems.length), [lang, cartItems.length]);

  return (
    <ul>
      {menu.map((item) => (
        <li className="mx-2 inline-block" key={item.id}>
          {item.to ? (
            <LocalLink
              href={item.to as AppRoutes}
              className={`hover:bg-lightGray text-md mb-2 flex w-full items-center gap-2 rounded-md p-2 font-semibold ${
                pathname === item.to ? "text-primary" : ""
              }`}
            >
              {item.name}
            </LocalLink>
          ) : (
            item.sub && (
              <DropdownButton
                className="text-md p-2 font-semibold"
                isHoverable
                options={item.sub.map((sub) => ({ name: sub.name, value: sub.to }))}
                onSelectItem={(value) => router.push(value)}
              >
                {item.name}
              </DropdownButton>
            )
          )}
        </li>
      ))}
    </ul>
  );
}
