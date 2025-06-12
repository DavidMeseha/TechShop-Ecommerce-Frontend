import React, { ChangeEvent, useRef } from "react";
import FormTextInput from "../ui/FormTextInput";
import RadioGroup from "../ui/RadioGroup";
import CheckboxGroup from "../ui/CheckboxGroup";
import FormDropdownInput from "../ui/FormDropdownInput";
import { ICustomeProductAttribute, IProductAttribute } from "@/types";
import ColorsGroup from "../ui/ColorsGroup";
import Input from "../ui/Input";

type Props = {
  productAttributes: IProductAttribute[];
  customAttributes: { _id: string; values: { _id: string }[] }[];
  onChange: (customAttributes: ICustomeProductAttribute[], quantity: number) => void;
};

export default function ProductAttributesForm({ productAttributes, customAttributes, onChange }: Props) {
  const quantity = useRef<HTMLInputElement>(null);

  const handleChange = (attributeId: string, value: string[] | string) => {
    let tempAttributes = [...customAttributes];
    const index = tempAttributes.findIndex((attr) => attr._id === attributeId);

    const originalAttribute = productAttributes.find((attr) => attr._id === attributeId) as IProductAttribute;
    const selectedValues = originalAttribute.values
      .filter((val) => value.includes(val._id))
      .map((val) => ({ _id: val._id }));

    tempAttributes[index] = { _id: originalAttribute._id, values: selectedValues };
    onChange(tempAttributes, quantity.current ? parseInt(quantity.current.value) : 1);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) > 10) e.target.value = "10";
    else if (parseInt(e.target.value) < 0) e.target.value = "0";
    onChange(customAttributes, parseInt(e.target.value ?? 1));
  };

  return (
    <>
      <div className="my-2 flex items-center gap-1 rounded-md border p-4">
        Quantity:{" "}
        <Input
          className="w-full"
          defaultValue="1"
          max="10"
          min="1"
          ref={quantity}
          type="number"
          onChange={handleQuantityChange}
        />
      </div>

      {productAttributes.map((attr, index) => (
        <div className="my-2 rounded-md border p-4" key={index}>
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
              value={customAttributes[index]?.values[0]._id ?? ""}
              options={attr.values.map((item) => ({
                name: item.name,
                value: item._id,
                color: item.colorRgb ?? "#fff"
              }))}
              onChange={(value) => handleChange(attr._id, value)}
            />
          )}
        </div>
      ))}
    </>
  );
}
