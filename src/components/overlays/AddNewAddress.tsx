import React, { useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useAppStore } from "@/stores/appStore";
import { FieldError } from "@/types";
import Button from "../ui/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "@/context/Translation";
import FormTextInput from "../FormTextInput";
import FormDropdownInput from "../FormDropdownInput";
import { citiesInCountry, newAddress } from "@/services/user.service";

interface FormErrors {
  address: FieldError;
  city: FieldError;
  country: FieldError;
}

const initialErrors: FormErrors = { address: false, city: false, country: false };
const initialForm = { _id: "", address: "", city: "", country: "" };

export default function AddNewAddress() {
  const queryClient = useQueryClient();
  const { setIsAddAddressOpen } = useAppStore();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<FormErrors>(initialErrors);
  const { t } = useTranslation();
  const { countries } = useAppStore();

  const newAddressMutation = useMutation({
    mutationKey: ["addAddress"],
    mutationFn: () => newAddress(form),
    onSuccess: () => {
      toast.success("Address Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["checkoutData"] });
    }
  });

  const citiesQuery = useQuery({
    queryKey: ["cities", form.country],
    queryFn: () =>
      citiesInCountry(form.country).then((data) => {
        setForm({ ...form, city: data[0]._id });
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

  const addNewAddress = () => {
    if (validate()) return;
    newAddressMutation.mutate();
  };

  const handleFieldOnChange = (value: string, name: string) => {
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: false });
  };

  return (
    <OverlayLayout className="max-h-none" close={() => setIsAddAddressOpen(false)} title="Add New Address">
      <FormTextInput
        error={error.address}
        name="address"
        placeholder={t("address")}
        type="text"
        value={form.address}
        onChange={(e) => handleFieldOnChange(e.target.value, e.target.name)}
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

      <Button
        className="w-full bg-primary py-2 text-white"
        isLoading={newAddressMutation.isPending}
        onClick={addNewAddress}
      >
        {t("addresses.addAddress")}
      </Button>
    </OverlayLayout>
  );
}
