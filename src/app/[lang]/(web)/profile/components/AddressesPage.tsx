"use client";

import FormDropdownInput from "@/components/FormDropdownInput";
import FormTextInput from "@/components/FormTextInput";
import { FieldError } from "@/types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/context/Translation";
import AddressItem from "./AddressItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/stores/appStore";
import { toast } from "react-toastify";
import { citiesInCountry, deleteAddress, newAddress, updateAddress, userAdresses } from "@/services/user.service";

interface FormErrors {
  address: FieldError;
  city: FieldError;
  country: FieldError;
}
type Tap = "newaddress" | "addresses" | "editaddress";
const initialErrors: FormErrors = { address: false, city: false, country: false };
const initialForm = { _id: "", address: "", city: "", country: "" };

export default function AddressesPage() {
  const [activeTap, setActiveTap] = useState<Tap>("addresses");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<FormErrors>(initialErrors);
  const { t } = useTranslation();
  const { countries } = useAppStore();

  useEffect(() => {
    if (!countries.length) return;
    setForm({ ...form, country: countries[0]._id });
  }, [countries]);

  const addresses = useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => userAdresses()
  });

  const newAddressMutation = useMutation({
    mutationKey: ["addAddress"],
    mutationFn: () => newAddress(form),
    onSuccess: () => {
      addresses.refetch();
      toast.success("Address Added Successfully");
    }
  });

  const deleteAddressMutation = useMutation({
    mutationKey: ["addAddress"],
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      addresses.refetch();
      toast.warn("Address deleted successfuly");
    }
  });

  const updateAddressMutation = useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: () => updateAddress(form),
    onSuccess: () => {
      addresses.refetch();
      toast.success("Address Updated Successfully");
    }
  });

  const citiesQuery = useQuery({
    queryKey: ["cities", form.country],
    queryFn: () =>
      citiesInCountry(form.country).then((data) => {
        setForm({ ...form, city: data.find((city) => city._id === form.city)?._id ?? data[0]._id });
        return data;
      }),
    enabled: !!form.country
  });

  const validate = () => {
    setError(initialErrors);
    let isError = false;
    let errors = { ...error };

    if (!form.address) {
      errors = { ...errors, address: t("addresses.addressIsRequired") };
      isError = true;
    }
    if (!form.city) {
      errors = { ...errors, city: t("addresses.cityIsRequired") };
      isError = true;
    }
    if (!form.country) {
      errors = { ...errors, country: t("addresses.countryIsRequired") };
      isError = true;
    }
    setError({ ...errors });
    return isError;
  };

  const addNewAddressSubmit = () => {
    if (validate()) return;
    newAddressMutation.mutate();
  };

  const updateAddressSubmit = () => {
    if (validate()) return;
    updateAddressMutation.mutate();
  };

  const changeTap = (value: Tap) => {
    setError(initialErrors);
    setActiveTap(value);

    if (value === "editaddress") {
      if (!addresses.data?.[0]) return;
      const address = addresses.data[0];
      setForm({ _id: address._id, city: address.city._id, address: address.address, country: address.country._id });
    } else setForm(initialForm);
  };

  const handleFieldOnChange = (value: string, name: string) => {
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: false });
  };

  const handleEditAddressChange = (id: string) => {
    const address = addresses.data?.findLast((address) => address._id === id) || null;
    if (!address) return;
    setForm({ _id: address._id, city: address.city._id, address: address.address, country: address.country._id });
  };

  return (
    <>
      <div className="sticky top-11 z-20 bg-white md:hidden">
        <ul className="z-10 flex items-center border-b bg-white">
          {addresses.data && addresses.data.length ? (
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
      <div className="px-4 pb-6 pt-4 md:mt-0">
        {activeTap === "addresses" ? (
          addresses.data && addresses.data.length > 0 ? (
            addresses.data.map((address) => (
              <AddressItem
                address={address}
                handleDelete={(id) => deleteAddressMutation.mutate(id)}
                key={address._id}
                handleEdit={(id) => {
                  changeTap("editaddress");
                  handleEditAddressChange(id);
                }}
              />
            ))
          ) : (
            <div className="text-center">
              No Avilable Adresses!{" "}
              <span className="cursor-pointer text-primary hover:underline" onClick={() => setActiveTap("newaddress")}>
                Add one ?
              </span>
            </div>
          )
        ) : null}

        {activeTap === "editaddress" || activeTap === "newaddress" ? (
          <>
            {activeTap === "editaddress" && (
              <FormDropdownInput
                error={form.address.length > 0 ? false : "Select and address to update"}
                label={t("addresses.addressToEdit")}
                name="addresstoedit"
                options={addresses.data?.map((address) => ({ name: address.address, value: address._id })) || []}
                value={form._id}
                onUpdate={handleEditAddressChange}
              />
            )}

            <FormTextInput
              error={error.address}
              label={t("address")}
              name="address"
              placeholder={t("address")}
              type="text"
              value={form.address}
              onChange={(e) => handleFieldOnChange(e.currentTarget.value, e.currentTarget.name)}
            />

            <FormDropdownInput
              error={error.country}
              label={t("country")}
              name="country"
              options={countries.map((country) => ({ name: country.name, value: country._id }))}
              value={form.country}
              onUpdate={handleFieldOnChange}
            />

            <FormDropdownInput
              error={error.city}
              isLoading={citiesQuery.isFetching}
              label={t("city")}
              name="city"
              options={citiesQuery.data?.map((city) => ({ name: city.name, value: city._id })) || []}
              value={form.city}
              onUpdate={handleFieldOnChange}
            />

            <div className="fixed bottom-0 start-0 z-30 w-full border border-x-0 bg-white px-6 py-4 md:start-[280px] md:w-[calc(100%-280px)]">
              <Button
                className="w-full bg-primary py-2 text-white"
                isLoading={newAddressMutation.isPending || addresses.isFetching}
                onClick={() => (activeTap === "newaddress" ? addNewAddressSubmit() : updateAddressSubmit())}
              >
                {activeTap === "newaddress" ? t("addresses.addAddress") : t("addresses.updateAddress")}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
