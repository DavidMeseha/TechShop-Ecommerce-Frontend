import useClickRecognition from "@/hooks/useClickRecognition";
import React, { useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IAddress } from "@/types";

type Props = {
  address: IAddress;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
};

export default function AddressItem({ address, handleDelete, handleEdit }: Props) {
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
          <div className="absolute end-0 z-30 w-44 rounded-md border bg-white">
            <ul className="text-sm">
              <li className="border-b-[1px] px-4 py-2">
                <button onClick={() => handleEdit(address._id)}>edit</button>
              </li>
              <li className="border-b-[1px] px-4 py-2">
                <button onClick={() => handleDelete(address._id)}>delete</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
