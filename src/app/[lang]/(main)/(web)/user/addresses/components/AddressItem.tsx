import useClickRecognition from "@/common/hooks/useClickRecognition";
import React, { useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IAddress } from "@/types";
import { useTranslation } from "@/common/context/Translation";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { toast } from "react-toastify";
import { deleteAddress } from "@/web/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADDRESSES_QUERY_KEY } from "@/common/constants/query-keys";

type Props = {
  address: IAddress;
};

export default function AddressItem({ address }: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [willDelete, setWillDelete] = useState(false);
  const menuRef = useRef(null);

  const deleteAddressMutation = useMutation({
    mutationKey: ["removeAddress"],
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADDRESSES_QUERY_KEY) });
      toast.warn("Address deleted");
    },
    onError: () => {
      setWillDelete(false);
      toast.error("Failed to delete address");
    }
  });

  const handleDelete = () => {
    setWillDelete(true);
    deleteAddressMutation.mutate(address._id);
  };

  useClickRecognition({ onOutsideClick: () => setShowMenu(false), containerRef: menuRef });

  return (
    <div
      className={`my-2 flex items-center justify-between rounded-md border p-2 ${willDelete && "pointer-events-none opacity-50"}`}
    >
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
                <LocalLink className="block w-full px-4 py-2 text-center" href={`/user/addresses/edit/${address._id}`}>
                  {t("addresses.edit")}
                </LocalLink>
              </li>
              <li className="border-b-[1px]">
                <button className="w-full px-4 py-2" onClick={handleDelete}>
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
