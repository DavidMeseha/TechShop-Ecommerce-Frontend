"use client";

import React, { useEffect, useState } from "react";
import { updateAddress } from "@/web/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressForm, AddressSchema } from "@/web/schemas/valdation";
import { useTranslation } from "@/common/context/Translation";
import { toast } from "react-toastify";
import FormDropdown from "@/common/components/ui/extend/FormDropdown";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useAppStore } from "@/web/stores/appStore";
import { IAddress } from "@/types";
import { ADDRESSES_QUERY_KEY, CITIES_QUERY_KEY } from "@/common/constants/query-keys";
import { citiesInCountry } from "@/web/services/countries.service";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { useRouter } from "@bprogress/next";
import FormInput from "@/common/components/ui/extend/FormInput";

type Props = {
  addresses: IAddress[];
  preSelectedAddress: IAddress | undefined;
};

export default function EditAddressPage({ addresses, preSelectedAddress }: Props) {
  const { countries } = useAppStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedAddress, setSelectedAddress] = useState<IAddress>(() => preSelectedAddress ?? addresses[0]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
    setValue
  } = useForm<AddressForm>({
    resolver: zodResolver(AddressSchema(t)),
    defaultValues: {
      address: selectedAddress.address,
      country: selectedAddress.country._id,
      city: selectedAddress.city._id
    }
  });

  const selectAddressToEdit = (id: string) => {
    const target = addresses.find((address) => address._id === id);
    if (target) {
      setSelectedAddress(target);
      setValue("address", target.address);
      setValue("country", target.country._id);
      setValue("city", target.city._id);
    }
  };

  const updateAddressMutation = useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: (form: AddressForm) => updateAddress({ ...form, _id: selectedAddress._id }),
    onSuccess: () => {
      router.push("/user/addresses");
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADDRESSES_QUERY_KEY) });
      toast.success("Address Updated Successfully");
    }
  });

  const citiesQuery = useQuery({
    queryKey: [CITIES_QUERY_KEY, getValues("country")],
    queryFn: () => citiesInCountry(getValues("country")),
    enabled: !!selectedAddress._id
  });
  const cities = citiesQuery.data ?? [];

  useEffect(() => {
    if (cities.length > 0) {
      if (selectedAddress && getValues("country") === selectedAddress.country._id)
        setValue("city", selectedAddress.city._id);
      else setValue("city", cities[0]._id);
    }
  }, [citiesQuery.data]);

  const updateAddressSubmit = (form: AddressForm) => {
    updateAddressMutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit(updateAddressSubmit)}>
      <FormDropdown
        error={selectedAddress._id ? null : t("addresses.selectAaddressToUpdate")}
        label={t("addresses.addressToEdit")}
        options={addresses.map((address) => ({ name: address.address, value: address._id })) || []}
        value={selectedAddress._id}
        onValueChange={(value) => selectAddressToEdit(value)}
      />
      <FormInput
        {...register("address", {
          onChange: () => clearErrors("address")
        })}
        error={errors.address?.message}
        label={t("address")}
        placeholder={t("address")}
        type="text"
      />

      <FormDropdown
        {...register("country", {
          onChange: () => clearErrors("country")
        })}
        error={errors.country?.message}
        label={t("country")}
        name="country"
        options={countries.map((country) => ({ name: country.name, value: country._id }))}
      />

      <FormDropdown
        {...register("city", {
          onChange: () => clearErrors("city"),
          value: selectedAddress.city._id
        })}
        error={errors.city?.message}
        isLoading={citiesQuery.isFetching}
        label={t("city")}
        options={cities.map((city) => ({ name: city.name, value: city._id })) || []}
      />

      <SubmitButton className="bg-primary py-2 text-white" isLoading={updateAddressMutation.isPending}>
        {t("addresses.editAddress")}
      </SubmitButton>

      <LocalLink className="ms-2 rounded-sm border border-primary px-4 py-2 text-primary" href="/user/addresses">
        {t("cancel")}
      </LocalLink>
    </form>
  );
}
