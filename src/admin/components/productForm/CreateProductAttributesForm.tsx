import { Button } from "@/common/components/ui/button";
import { Label } from "@/common/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import React from "react";
import { AttributeValuesInput } from "./AttributeValuesInput";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Input } from "@/common/components/ui/input";
import { ProductForm } from "@/admin/schemas/valdation";
import { attributeTypes } from "@/common/constants/values";
import ErrorMessage from "@/common/components/ui/extend/ErrorMessage";

type Props = {
  form: UseFormReturn<ProductForm>;
};

export default function CreateProductAttributesForm({ form }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes"
  });

  return (
    <>
      <div>
        <Label>Attributes</Label>
        {fields.map((field, idx) => (
          <div className="mb-2 rounded border p-2" key={field.id}>
            <div className="flex items-center gap-2">
              <Input placeholder="Attribute Name" {...form.register(`attributes.${idx}.name` as const)} />
              <Select
                value={form.watch(`attributes.${idx}.attributeControlType`)}
                onValueChange={(val) => form.setValue(`attributes.${idx}.attributeControlType`, val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {attributeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="destructive" onClick={() => remove(idx)}>
                Remove
              </Button>
            </div>
            <ErrorMessage
              error={
                form.formState.errors.attributes?.[idx]?.attributeControlType?.message ||
                form.formState.errors.attributes?.[idx]?.attributeControlType?.message
              }
            />
            {/* Values */}
            <AttributeValuesInput
              attrIdx={idx}
              form={form}
              type={form.watch(`attributes.${idx}.attributeControlType`)}
            />
          </div>
        ))}
      </div>
      {fields.length < 10 && (
        <Button
          className="w-full"
          type="button"
          onClick={() =>
            append({
              attributeControlType: "DropdownList",
              name: "",
              values: []
            })
          }
        >
          Add Attribute +
        </Button>
      )}
    </>
  );
}
