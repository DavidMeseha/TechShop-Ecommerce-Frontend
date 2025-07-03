"use client";

import ProductForm from "@/admin/components/productForm/productForm";
import { ADMIN_PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";
import { ProductForm as ProductInputForm } from "@/admin/schemas/valdation";
import { createProduct } from "@/admin/services/createProduct";
import { useRouter } from "@bprogress/next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CreateProductPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createProductMutation = useMutation({
    mutationFn: (form: ProductInputForm) => createProduct(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) });
      toast.success("Product created!");
      router.push("/admin/products");
    },
    onError: () => toast.error("Failed to create product")
  });

  return (
    <div className="mx-auto py-10">
      <div className="rounded-xl border bg-card p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-primary">Create Product</h1>
        <ProductForm
          isPending={createProductMutation.isPending}
          onSubmit={(form) => createProductMutation.mutate(form as ProductInputForm)}
        />
      </div>
    </div>
  );
}
