import React from "react";
import { newAddress } from "@/web/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressForm, AddressSchema } from "@/web/schemas/valdation";
import { useTranslation } from "@/common/context/Translation";
import { toast } from "react-toastify";
import FormInput from "@/common/components/ui/extend/FormInput";
import FormDropdown from "@/common/components/ui/extend/FormDropdown";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useAppStore } from "@/common/stores/appStore";
import { ADDRESSES_QUERY_KEY, CITIES_QUERY_KEY, CHECKOUT_QUERY_KEY } from "@/common/constants/query-keys";
import { citiesInCountry } from "@/web/services/countries.service";

type Props = { onFinish?: () => void; onCancel: () => void };

export default function NewAddressForm({ onFinish, onCancel }: Props) {
  const { countries } = useAppStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    getValues,
    setValue
  } = useForm<AddressForm>({
    resolver: zodResolver(AddressSchema(t))
  });

  const newAddressMutation = useMutation({
    mutationKey: ["addAddress"],
    mutationFn: (form: AddressForm) => newAddress(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes(ADDRESSES_QUERY_KEY) });
      await queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes(CHECKOUT_QUERY_KEY) });
      onFinish?.();
      toast.success("Address Added Successfully");
    }
  });

  const citiesQuery = useQuery({
    queryKey: [CITIES_QUERY_KEY, getValues("country")],
    queryFn: () =>
      citiesInCountry(getValues("country")).then((data) => {
        setValue("city", data[0]._id);
        return data;
      }),
    enabled: !!getValues("country")
  });

  const cities = citiesQuery.data ?? [];
  const addNewAddressSubmit = (form: AddressForm) => newAddressMutation.mutate(form);

  return (
    <form onSubmit={handleSubmit(addNewAddressSubmit)}>
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
          onChange: () => clearErrors("city")
        })}
        error={errors.city?.message}
        isLoading={citiesQuery.isFetching}
        label={t("city")}
        name="city"
        options={cities.map((city) => ({ name: city.name, value: city._id })) || []}
      />

      <SubmitButton className="bg-primary py-2 text-white" isLoading={newAddressMutation.isPending}>
        {t("addresses.addAddress")}
      </SubmitButton>
      <a className="ms-2 rounded-sm border border-primary px-4 py-2 text-primary" onClick={onCancel}>
        {t("cancel")}
      </a>
    </form>
  );
}
