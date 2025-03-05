import useClickRecognition from "@/hooks/useClickRecognition";
import React, { useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IAddress } from "@/types";
import { useTranslation } from "@/context/Translation";

type Props = {
  address: IAddress;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
};

export default function AddressItem({ address, handleDelete, handleEdit }: Props) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useClickRecognition({ onOutsideClick: () => setShowMenu(false), containerRef: menuRef });
  return (
    <div className="mb-6 flex justify-between">
      <div className="w-10/12">
        <h3 className="text-lg font-bold">{address.address}</h3>
        <p className="text-sm text-gray-400">
          {address.city.name}, {address.country.name}
        </p>
      </div>
      <div className="relative" ref={menuRef}>
        <button onClick={() => setShowMenu(!showMenu)}>
          <BiDotsVerticalRounded size={25} />
        </button>
        {showMenu && (
          <div className="absolute end-0 z-30 w-32 rounded-md border bg-white">
            <ul className="text-sm">
              <li className="border-b-[1px]">
                <button className="w-full px-4 py-2" onClick={() => handleEdit(address._id)}>
                  {t("addresses.edit")}
                </button>
              </li>
              <li className="border-b-[1px]">
                <button className="w-full px-4 py-2" onClick={() => handleDelete(address._id)}>
                  {t("addresses.delete")}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
