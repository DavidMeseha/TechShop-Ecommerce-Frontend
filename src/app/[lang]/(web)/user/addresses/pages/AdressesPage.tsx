"use client";

import React from "react";
import { userAdresses } from "@/web/services/user.service";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";
import { ADDRESSES_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";
import { useQuery } from "@tanstack/react-query";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import AddressItem from "../components/AddressItem";
import { useTranslation } from "@/common/context/Translation";

export default function AdressesPage() {
  const { t } = useTranslation();

  const addressesQuery = useQuery({
    queryKey: [USER_QUERY_KEY, ADDRESSES_QUERY_KEY],
    queryFn: () => userAdresses()
  });
  const addresses = addressesQuery.data && "_id" in addressesQuery.data[0] ? addressesQuery.data : [];

  if (addressesQuery.isPending) return <LoadingSpinner />;
  if (addresses.length > 0) return addresses.map((address) => <AddressItem address={address} key={address._id} />);

  return (
    <div className="text-center">
      {t("addresses.noAvilableAdresses")}{" "}
      <LocalLink className="cursor-pointer text-primary hover:underline" href="/user/addresses/add">
        {t("addresses.addOne")}
      </LocalLink>
    </div>
  );
}
