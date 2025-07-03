import { attributeTypes, genders } from "@/common/constants/values";
import z from "zod";

export const productSchema = z.object({
  images: z.array(z.string()).min(1, "At least one image is required"),
  name: z.string().min(1, "Product name is required"),
  seName: z.string(),
  sku: z.string(),
  fullDescription: z.string().min(1, "Description is required"),
  price: z.object({
    price: z.number().min(1, "Price is required"),
    oldPrice: z.number().optional()
  }),
  gender: z.enum(genders),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "should at least add 1 tag"),
  stock: z.number().min(0, "Stock is required"),
  attributes: z
    .array(
      z.object({
        _id: z.optional(z.string()),
        attributeControlType: z.enum(attributeTypes),
        name: z.string().min(1, "Attribute name required"),
        values: z
          .array(
            z.object({
              _id: z.optional(z.string()),
              name: z.string().min(1, "Value required"),
              priceAdjustmentValue: z.number(),
              colorRgb: z.string().optional()
            })
          )
          .min(2, "At least 2 values are Needed")
      })
    )
    .max(10)
});

export type ProductForm = z.infer<typeof productSchema>;
