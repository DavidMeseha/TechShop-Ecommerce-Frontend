import React, { useEffect, useState } from "react";
import { citiesInCountry, updateAddress } from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressForm, AddressSchema } from "@/schemas/valdation";
import { useTranslation } from "@/context/Translation";
import { toast } from "react-toastify";
import FormTextInput from "../FormTextInput";
import FormDropdownInput from "../FormDropdownInput";
import Button from "../ui/Button";
import { useAppStore } from "@/stores/appStore";
import { IAddress } from "@/types";

type Props = {
  addresses: IAddress[];
  preSelectedAddress: IAddress | undefined;
  onFinish: () => void;
};

export default function EditAddressPage({ addresses, preSelectedAddress, onFinish }: Props) {
  const { countries } = useAppStore();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      onFinish();
      toast.success("Address Updated Successfully");
    }
  });

  const citiesQuery = useQuery({
    queryKey: ["cities", getValues("country")],
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
      <FormDropdownInput
        error={selectedAddress._id ? false : t("addresses.selectAaddressToUpdate")}
        label={t("addresses.addressToEdit")}
        options={addresses.map((address) => ({ name: address.address, value: address._id })) || []}
        value={selectedAddress._id}
        onChange={(e) => selectAddressToEdit(e.currentTarget.value)}
      />
      <FormTextInput
        {...register("address", {
          onChange: () => clearErrors("address")
        })}
        error={errors.address?.message}
        label={t("address")}
        placeholder={t("address")}
        type="text"
      />

      <FormDropdownInput
        {...register("country", {
          onChange: () => clearErrors("country")
        })}
        error={errors.country?.message}
        label={t("country")}
        name="country"
        options={countries.map((country) => ({ name: country.name, value: country._id }))}
      />

      <FormDropdownInput
        {...register("city", {
          onChange: () => clearErrors("city"),
          value: selectedAddress.city._id
        })}
        error={errors.city?.message}
        isLoading={citiesQuery.isFetching}
        label={t("city")}
        options={cities.map((city) => ({ name: city.name, value: city._id })) || []}
      />
      <Button className="bg-primary py-2 text-white" isLoading={updateAddressMutation.isPending}>
        {t("addresses.editAddress")}
      </Button>
      <a className="ms-2 rounded-sm border border-primary px-4 py-2 text-primary" onClick={onFinish}>
        {t("cancel")}
      </a>
    </form>
  );
}
