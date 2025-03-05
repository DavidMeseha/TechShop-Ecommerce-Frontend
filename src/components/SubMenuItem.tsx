import { LocalLink } from "@/components/LocalizedNavigation";
import React, { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";
import { useLocalPathname } from "./LocalizedNavigation";

type Props = {
  item: {
    name: string;
    sup?: { name: string; to: string }[];
    icon: React.ReactNode;
    iconActive: React.ReactNode;
    to?: string;
  };
};

export default function SubMenuItem({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocalPathname();

  return (
    <>
      <button
        className="hover:bg-lightGray mb-2 flex w-full justify-between rounded-md p-2 text-lg font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          {item.name}
        </div>
        <RiArrowDropDownLine size={25} />
      </button>
      <ul
        className={`${isOpen ? "max-h-52" : "max-h-0"} overflow-hidden transition-all duration-500`}
        data-testid="sub-items"
      >
        {item.sup?.map((supItem, index) => (
          <li className="my-2 w-10/12 md:w-full" key={index}>
            <LocalLink
              href={supItem.to}
              className={`hover:bg-lightGray flex w-full items-center gap-1 rounded-md p-2 ps-6 text-lg font-semibold ${
                pathname === supItem.to ? "text-primary" : ""
              }`}
            >
              <RiArrowDropLeftLine className="hidden rtl:block" data-testid="sub-menu-left-icon" size={20} />
              <RiArrowDropRightLine className="rtl:hidden" data-testid="sub-menu-right-icon" size={20} />
              {supItem.name}
            </LocalLink>
          </li>
        ))}
      </ul>
    </>
  );
}
