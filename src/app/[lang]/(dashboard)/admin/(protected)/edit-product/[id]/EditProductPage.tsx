"use client";

import ProductForm from "@/admin/components/productForm/productForm";
import { ADMIN_PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";
import { ProductForm as ProductInputForm } from "@/admin/schemas/valdation";
import { editProduct } from "@/admin/services/createProduct";
import { IFullProduct } from "@/types";
import { useRouter } from "@bprogress/next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "@/common/context/Translation";

type Props = { product: IFullProduct };

export default function EditProductPage({ product }: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  const updateProductMutation = useMutation({
    mutationFn: (form: Partial<ProductInputForm>) => editProduct(form, product._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) });
      toast.success(t("admin.productUpdated"));
      router.push("/admin/products");
    },
    onError: () => toast.error(t("admin.updateProductFailed"))
  });

  return (
    <div className="mx-auto py-10">
      <div className="rounded-xl border bg-card p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-primary">Edit Product</h1>
        <ProductForm
          isPending={updateProductMutation.isPending}
          product={product}
          onSubmit={(form) => updateProductMutation.mutate(form)}
        />
      </div>
    </div>
  );
}
