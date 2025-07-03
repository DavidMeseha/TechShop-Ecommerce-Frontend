import { attributeTypes, genders } from "@/common/constants/values";
import { TFunction } from "@/types";
import z from "zod";

export const productSchema = (t: TFunction) =>
  z.object({
    images: z.array(z.string()).min(1, t("admin.imageRequired")),
    name: z.string().min(1, t("admin.productNameRequired")),
    seName: z.string().min(1),
    sku: z.string().min(1),
    fullDescription: z.string().min(1, t("admin.descriptionRequired")),
    price: z.object({
      price: z.number().min(1, t("admin.priceRequired")),
      oldPrice: z.number().optional()
    }),
    gender: z.enum(genders),
    category: z.string().min(1, t("admin.categoryRequired")),
    tags: z.array(z.string()).min(1, t("admin.minOneTag")),
    stock: z.number().min(0, t("admin.stockRequired")),
    attributes: z
      .array(
        z.object({
          _id: z.optional(z.string()),
          attributeControlType: z.enum(attributeTypes),
          name: z.string().min(1, t("admin.attributeNameEmptyError")),
          values: z
            .array(
              z.object({
                _id: z.optional(z.string()),
                name: z.string().min(1, t("admin.attributeValueNameEmptyError")),
                priceAdjustmentValue: z.number(),
                colorRgb: z.string().optional()
              })
            )
            .min(2, t("admin.attributeValuesMinimumError"))
        })
      )
      .max(10)
  });

export type ProductForm = z.infer<ReturnType<typeof productSchema>>;
