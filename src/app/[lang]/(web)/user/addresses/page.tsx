"use client";

import React, { useState } from "react";
import { useTranslation } from "@/context/Translation";
import AddressItem from "@/components/AddressItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import NewAddressPage from "@/components/pages/NewAddressPage";
import EditAddressPage from "@/components/pages/EditAddressPage";
import { deleteAddress, userAdresses } from "@/services/user.service";
import Button from "@/components/ui/Button";
import { IAddress } from "@/types";
import { ADDRESSES_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";

type Tap = "newaddress" | "addresses" | "editaddress";

export default function Page() {
  const [activeTap, setActiveTap] = useState<Tap>("addresses");
  const [preSelectedAddress, setPreSelectedAddress] = useState<IAddress | undefined>();
  const { t } = useTranslation();

  const addressesQuery = useQuery({
    queryKey: [USER_QUERY_KEY, ADDRESSES_QUERY_KEY],
    queryFn: () => userAdresses()
  });
  const addresses = addressesQuery.data ?? [];

  const deleteAddressMutation = useMutation({
    mutationKey: ["removeAddress"],
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      addressesQuery.refetch();
      toast.warn("Address deleted successfuly");
    }
  });

  const changeTap = (value: Tap) => setActiveTap(value);

  return (
    <>
      {activeTap === "addresses" && (
        <div className="flex justify-end p-4">
          <Button className="bg-primary text-white" onClick={() => setActiveTap("newaddress")}>
            {t("addresses.newAddress")} +
          </Button>
        </div>
      )}
      <div className="sticky top-11 z-20 bg-white md:hidden">
        <ul className="z-10 flex items-center border-b bg-white">
          {addresses && addresses.length ? (
            <li className={`w-full ${activeTap === "editaddress" && "-mb-0.5 border-b-2 border-b-black"}`}>
              <a className="flex cursor-pointer justify-center py-2" onClick={() => changeTap("editaddress")}>
                {t("addresses.editAddress")}
              </a>
            </li>
          ) : null}
          <li className={`w-full ${activeTap === "newaddress" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <a className="flex cursor-pointer justify-center py-2" onClick={() => changeTap("newaddress")}>
              {t("addresses.newAddress")}
            </a>
          </li>
          <li className={`w-full ${activeTap === "addresses" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <a className="flex cursor-pointer justify-center py-2" onClick={() => changeTap("addresses")}>
              {t("profile.addresses")}
            </a>
          </li>
        </ul>
      </div>

      {addressesQuery.isPending ? (
        <LoadingSpinner />
      ) : (
        <div className="px-4 pb-6 pt-4 md:mt-0">
          {activeTap === "addresses" ? (
            addresses.length > 0 ? (
              addresses.map((address) => (
                <AddressItem
                  address={address}
                  handleDelete={(id) => deleteAddressMutation.mutate(id)}
                  key={address._id}
                  handleEdit={() => {
                    setPreSelectedAddress(address);
                    changeTap("editaddress");
                  }}
                />
              ))
            ) : (
              <div className="text-center">
                {t("addresses.noAvilableAdresses")}{" "}
                <span
                  className="cursor-pointer text-primary hover:underline"
                  onClick={() => setActiveTap("newaddress")}
                >
                  {t("addresses.addOne")}
                </span>
              </div>
            )
          ) : null}

          {activeTap === "editaddress" ? (
            <EditAddressPage
              addresses={addresses}
              preSelectedAddress={preSelectedAddress}
              onFinish={() => setActiveTap("addresses")}
            />
          ) : null}
          {activeTap === "newaddress" ? <NewAddressPage onFinish={() => setActiveTap("addresses")} /> : null}
        </div>
      )}
    </>
  );
}
