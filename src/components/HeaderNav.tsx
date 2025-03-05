import { useUserStore } from "@/stores/userStore";
import React, { useMemo } from "react";
import { LocalLink, useLocalPathname } from "./LocalizedNavigation";
import { useTranslation } from "@/context/Translation";
import mainNavItems from "@/schemas/mainNavItems";
import DropdownButton from "./DropdownButton";
import { useRouter } from "next-nprogress-bar";

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
              href={item.to}
              className={`hover:bg-lightGray text-md mb-2 flex w-full items-center gap-2 rounded-md p-2 font-semibold ${
                pathname === item.to ? "text-primary" : ""
              }`}
            >
              {item.name}
            </LocalLink>
          ) : (
            item.sup && (
              <DropdownButton
                className="text-md p-2 font-semibold"
                options={item.sup?.map((sub) => sub.name)}
                onSelectItem={(target) => router.push(item.sup.find((sub) => sub.name === target)?.to ?? "")}
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
