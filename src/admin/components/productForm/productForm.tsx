"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Input } from "@/common/components/ui/input";
import { Textarea } from "@/common/components/ui/textarea";
import { Label } from "@/common/components/ui/label";
import FormInput from "@/common/components/ui/extend/FormInput";
import FormDropdown from "@/common/components/ui/extend/FormDropdown";
import CategorySelect from "@/admin/components/selectors/CategorySelect";
import TagsSelector from "@/admin/components/selectors/TagsSelector";
import { ProductForm as ProductInputForm, productSchema } from "@/admin/schemas/valdation";
import { genders } from "@/common/constants/values";
import CreateProductAttributesForm from "./CreateProductAttributesForm";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import ProductImageInput from "./ProductImageInput";
import { avilableSeNameAndSku } from "@/admin/services/sename-sku";
import useDebounce from "@/common/hooks/useDebounce";
import { IFullProduct } from "@/types";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";
import ErrorMessage from "@/common/components/ui/extend/ErrorMessage";
import { getChangedFields } from "../utils";
import { toast } from "react-toastify";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";

type Props = {
  product?: IFullProduct;
  onSubmit: (form: ProductInputForm | Partial<ProductInputForm>) => void;
  isPending?: boolean;
};

export default function ProductForm({ product, onSubmit, isPending }: Props) {
  const initialValues: ProductInputForm = useMemo(
    () =>
      product
        ? {
            attributes: [...product.productAttributes] as any,
            category: product.category._id,
            fullDescription: product.fullDescription,
            gender: product.gender as any,
            images: product.pictures.map((pic) => pic.imageUrl),
            name: product.name,
            price: { price: product.price.price, oldPrice: product.price.old ?? 0 },
            stock: product.stock,
            tags: product.productTags,
            seName: product.seName,
            sku: product.sku
          }
        : {
            images: [],
            name: "",
            seName: "",
            sku: "",
            fullDescription: "",
            price: { price: 0, oldPrice: 0 },
            gender: genders[0],
            category: "",
            tags: [],
            stock: 0,
            attributes: []
          },
    []
  );
  const isEdit = !!product;

  const form = useForm<ProductInputForm>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues
  });

  const debouncedNameChange = useDebounce((value: string) => form.setValue("name", value));

  const uniqueSKUandSeNameQuery = useQuery({
    queryKey: ["unique-sku-and-sename", form.watch("name")],
    queryFn: () => avilableSeNameAndSku({ name: form.getValues("name") }),
    enabled: form.watch("name") !== initialValues.name
  });
  form.setValue("seName", uniqueSKUandSeNameQuery.data?.seName || initialValues.seName);
  form.setValue("sku", uniqueSKUandSeNameQuery.data?.sku || initialValues.sku);

  const handleTagsChange = (values: string[]) => form.setValue("tags", values);

  return (
    <form
      className="relative"
      onSubmit={form.handleSubmit((data) => {
        if (isEdit) {
          const changed = getChangedFields(initialValues, data);
          if (JSON.stringify(changed) === JSON.stringify({})) return toast.warning("Nothing changed to be submitted");
          return onSubmit(changed);
        }
        onSubmit(data);
      })}
    >
      {isPending && (
        <div className="absolute z-40 flex h-full w-full items-center justify-center bg-white/60">
          <LoadingSpinner />
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Images */}
        <div className="md:col-span-2">
          <ProductImageInput
            images={form.watch("images") ?? []}
            onChange={(values) => form.setValue("images", values)}
          />
          <ErrorMessage error={form.formState.errors.images?.message} />
        </div>

        {/* Name, seName, SKU */}
        <div>
          <FormInput
            label="Product Name"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            onChange={(e) => debouncedNameChange(e.currentTarget.value)}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-muted-foreground">seName</Label>
              <Input disabled readOnly value={form.getValues("seName")} />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground">SKU</Label>
              <Input disabled readOnly value={form.getValues("sku")} />
            </div>
          </div>
        </div>

        {/* Price */}
        <div>
          <div>
            <FormInput
              label="Current Price"
              step="0.01"
              type="number"
              {...form.register("price.price", { valueAsNumber: true })}
              error={form.formState.errors.price?.price?.message}
            />
          </div>
          <div className="mt-1">
            <FormInput
              label="Old Price"
              step="0.01"
              type="number"
              {...form.register("price.oldPrice", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label>Full Description</Label>
          <Textarea {...form.register("fullDescription")} className="resize-none" rows={4} />
          <ErrorMessage error={form.formState.errors.fullDescription?.message} />
        </div>

        {/* Gender */}
        <div>
          <FormDropdown
            label="Gender"
            options={genders.map((g) => ({ name: g, value: g }))}
            value={form.watch("gender")}
            onValueChange={(val) => form.setValue("gender", val as any)}
          />
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <CategorySelect
            preSelectedCategoryName={product?.category.name}
            selectedCategoryId={form.watch("category")}
            onChange={(category) => form.setValue("category", category)}
          />
          {}
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <TagsSelector tags={form.watch("tags") ?? []} onChange={handleTagsChange} />
          <ErrorMessage error={form.formState.errors.tags?.message} />
        </div>

        {/* Stock */}
        <div>
          <Label>Stock</Label>
          <Input type="number" {...form.register("stock", { valueAsNumber: true })} />
        </div>

        {/* Attributes */}
        <div className="md:col-span-2">
          <CreateProductAttributesForm form={form} />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <SubmitButton disabled={isPending} isLoading={isPending} type="submit">
          {product ? "Update Product" : "Create Product"}
        </SubmitButton>
        <LocalLink className="border-primary text-primary" href="/admin/products">
          Cancel
        </LocalLink>
      </div>
    </form>
  );
}
