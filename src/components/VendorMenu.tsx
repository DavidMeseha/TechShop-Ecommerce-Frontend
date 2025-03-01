import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import SubMenuItem from "./SubMenuItem";
import { useTranslation } from "@/context/Translation";
import { BsCompass, BsCompassFill } from "react-icons/bs";

export default function VendorMenu() {
  const { t, lang } = useTranslation();
  const menu = [
    {
      name: t("menu.dashboard"),
      to: `/${lang}/vendor/dashboard`,
      Icon: <BsCompass size={20} />,
      IconActive: <BsCompassFill size={20} />
    },
    {
      name: t("menu.yourProducts"),
      to: `/${lang}/vendor/products`,
      Icon: <BsCompass size={20} />,
      IconActive: <BsCompassFill size={20} />
    },
    {
      name: t("menu.orders"),
      to: `/${lang}/vendor/orders`,
      Icon: <BsCompass size={20} />,
      IconActive: <BsCompassFill size={20} />
    },
    {
      name: t("menu.shipments"),
      to: `/${lang}/vendor/shipments`,
      Icon: <BsCompass size={20} />,
      IconActive: <BsCompassFill size={20} />
    },
    {
      name: t("menu.reports"),
      sup: [
        {
          name: t("menu.lowStock"),
          to: `/${lang}/vendor/reports/lowstock`
        },
        {
          name: t("menu.bestsellers"),
          to: `/${lang}/vendor/reports/bestsellers`
        },
        {
          name: t("menu.productsNeverPurchased"),
          to: `/${lang}/vendor/reports/neverpurchased`
        }
      ],
      Icon: <BsCompass size={20} />,
      IconActive: <BsCompassFill size={20} />
    }
  ];

  return (
    <>
      <ul className="capitalize">
        {menu.map((item, index) => (
          <li key={index}>
            {item.to ? (
              <LocalLink
                className="hover:bg-lightGray block w-full rounded-md p-2 text-lg font-semibold"
                href={item.to}
              >
                {item.name}
              </LocalLink>
            ) : (
              item.sup && <SubMenuItem item={item} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
