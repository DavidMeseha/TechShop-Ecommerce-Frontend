import { Badge } from "@/common/components/ui/badge";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import Tag from "@/common/components/ui/Tag";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { ADMIN_PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";
import { deleteProduct, republishProduct } from "@/admin/services/productActions";
import { IFullProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Bookmark, Edit, Heart, Redo2, ShoppingCart, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  product: IFullProduct;
};

export default function ProductCard({ product }: Props) {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationKey: ["delete-product", product._id],
    mutationFn: () => deleteProduct(product._id),
    onSuccess: () => queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) })
  });

  const republishProductMutation = useMutation({
    mutationKey: ["delete-product", product._id],
    mutationFn: () => republishProduct(product._id),
    onSuccess: () => queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) })
  });

  return (
    <div
      className={`relative flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:flex-row sm:items-start ${product.stock > 0 && !product.deleted ? "" : "border-destructive"}`}
    >
      <div className="absolute start-2 top-2 z-20 flex gap-2">
        {product.deleted && <Tag variant="error">Deleted</Tag>}
        {product.stock < 1 && <Tag variant="error">No Stock</Tag>}
      </div>
      <div className="relative h-32 w-full flex-shrink-0 sm:w-32">
        <Image alt={product.name} className="rounded-md object-contain" fill src={product.pictures[0].imageUrl} />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div>
          <h3 className="me-4 inline-block font-semibold">{product.name}</h3>
          <p className="inline-block font-bold text-primary">${product.price.price}</p>
        </div>
        <p className="text-sm text-muted-foreground">Category: {product.category.name}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
          <span className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-400" />
            {product.productReviewOverview.totalReviews
              ? (product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews).toFixed(1)
              : 0}
          </span>

          <div className="flex gap-2">
            <Badge className="flex items-center gap-1" variant="outline">
              <Heart className="h-3 w-3" /> {product.likes}
            </Badge>
            <Badge className="flex items-center gap-1" variant="outline">
              <Bookmark className="h-3 w-3" /> {product.saves}
            </Badge>
            <Badge className="flex items-center gap-1" variant="outline">
              <ShoppingCart className="h-3 w-3" /> {product.carts}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <p>Created: {format(new Date(product.createdAt), "PP")}</p>
          <p>Updated: {format(new Date(product.updatedAt), "PP")}</p>
        </div>
      </div>

      <div className="flex">
        <LocalLink
          className="bg-white p-3 text-foreground hover:bg-white hover:text-primary"
          href={`/admin/edit-product/${product._id}`}
        >
          <Edit className="h-4 w-4" />
        </LocalLink>
        {product.deleted ? (
          <SubmitButton
            className="bg-transparent fill-black text-foreground hover:bg-white hover:text-green-600"
            isLoading={republishProductMutation.isPending}
            onClick={() => republishProductMutation.mutate()}
          >
            <Redo2 className="h-4 w-4" />
          </SubmitButton>
        ) : (
          <SubmitButton
            className="bg-white fill-black text-foreground hover:bg-white hover:text-destructive"
            isLoading={deleteProductMutation.isPending}
            onClick={() => deleteProductMutation.mutate()}
          >
            <Trash2 className="h-4 w-4" />
          </SubmitButton>
        )}
      </div>
    </div>
  );
}
