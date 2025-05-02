import React from "react";
import FormTextInput from "../FormTextInput";
import RadioGroup from "../RadioGroup";
import CheckboxGroup from "../CheckboxGroup";
import FormDropdownInput from "../FormDropdownInput";
import { IProductAttribute } from "@/types";
import ColorsGroup from "../ColorsGroup";

type Props = {
  productAttributes: IProductAttribute[];
  customAttributes: IProductAttribute[];
  handleChange: (id: string, value: any) => void;
};

export default function ProductAttributes({ productAttributes, customAttributes, handleChange }: Props) {
  return productAttributes.map((attr, index) => (
    <div className="border p-4 my-2 rounded-md" key={index}>
      {attr.attributeControlType === "TextBox" && (
        <FormTextInput
          label={attr.name}
          type="text"
          value={customAttributes[index].values[0]._id}
          onChange={(e) => handleChange(attr._id, e.currentTarget.value)}
        />
      )}

      {attr.attributeControlType === "DropdownList" && (
        <FormDropdownInput
          label={attr.name}
          name={attr.name}
          options={attr.values.map((item) => ({ name: item.name, value: item._id }))}
          value={customAttributes[index]?.values[0]._id ?? ""}
          onChange={(e) => handleChange(attr._id, e.currentTarget.value)}
        />
      )}

      {attr.attributeControlType === "Checkboxes" && (
        <CheckboxGroup
          options={attr.values.map((item) => ({ name: item.name, value: item._id }))}
          title={attr.name}
          values={customAttributes[index]?.values ? customAttributes[index].values.map((attr) => attr._id) : ""}
          onChange={(value) => handleChange(attr._id, value)}
        />
      )}

      {attr.attributeControlType === "RadioList" && (
        <RadioGroup
          checkedValue={customAttributes[index]?.values[0]._id ?? ""}
          options={attr.values.map((item) => ({ name: item.name, value: item._id }))}
          title={attr.name}
          onChange={(e) => handleChange(attr._id, e.currentTarget.value)}
        />
      )}

      {attr.attributeControlType === "Color" && (
        <ColorsGroup
          title={attr.name}
          values={customAttributes[index]?.values[0]._id ?? ""}
          options={attr.values.map((item) => ({
            name: item.name,
            value: item._id,
            color: item.colorRgb ?? "#fff"
          }))}
          onChange={(value) => handleChange(attr._id, value)}
        />
      )}
    </div>
  ));
}
