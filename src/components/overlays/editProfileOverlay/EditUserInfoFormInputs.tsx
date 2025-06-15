import FormTextInput from "@/components/ui/FormTextInput";
import RadioGroup from "@/components/ui/RadioGroup";
import DateDropdownNumbers from "@/components/ui/DateDropdownNumbers";
import React from "react";
import { FieldErrors, UseFormClearErrors, UseFormRegister } from "react-hook-form";
import { UserInfoForm } from "@/services/types";

type Props = {
  register: UseFormRegister<UserInfoForm>;
  errors: FieldErrors<UserInfoForm>;
  clearErrors: UseFormClearErrors<UserInfoForm>;
};

export default function EditUserInfoFormInputs({ register, errors, clearErrors }: Props) {
  return (
    <div className="mt-1.5 w-full border-b p-2">
      <FormTextInput
        {...register("firstName", {
          onChange: () => clearErrors("firstName")
        })}
        error={errors.firstName?.message}
        label="First Name"
        placeholder="First Name"
      />
      <FormTextInput
        {...register("lastName", {
          onChange: () => clearErrors("lastName")
        })}
        error={errors.lastName?.message}
        label="Last Name"
        placeholder="Last Name"
      />
      <RadioGroup
        title="Gender"
        options={[
          { name: "Male", value: "male" },
          { name: "Female", value: "female" }
        ]}
        zodRegister={register("gender", {
          onChange: () => clearErrors("gender")
        })}
      />
      <DateDropdownNumbers
        className="mb-4"
        title="Date Of Birth"
        dayInputAttributes={{
          ...register("dateOfBirthDay")
        }}
        monthInputAttributes={{
          ...register("dateOfBirthMonth")
        }}
        yearInputAttributes={{
          ...register("dateOfBirthYear")
        }}
      />
      <FormTextInput
        {...register("phone", {
          onChange: () => clearErrors("phone")
        })}
        error={errors.phone?.message}
        label="Phone Number"
        placeholder="Phone Number"
      />
    </div>
  );
}
