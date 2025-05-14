import { FieldError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addReview } from "@/services/products.service";
import React, { useState } from "react";
import RatingStars from "../ui/RatingStars";
import Button from "../ui/Button";
import { useTranslation } from "@/context/Translation";
import useAdjustProductsQueries from "@/hooks/useAdjustProductsQueries";

type FormError = {
  reviewText: FieldError;
  rating: FieldError;
};

type Props = {
  productId: string;
  onSuccess?: () => void;
};

export default function AddReviewForm({ productId, onSuccess }: Props) {
  const [form, setForm] = useState({ reviewText: "", rating: 0 });
  const [error, setError] = useState<FormError>({ reviewText: false, rating: false });
  const { t } = useTranslation();
  const adjustProductsQueries = useAdjustProductsQueries(productId);

  const addReviewMutation = useMutation({
    mutationKey: ["AddReview", productId],
    mutationFn: (productId: string) => addReview(productId, form),
    onSuccess: () => {
      toast.success("Review Added Successfully");
      adjustProductsQueries({ isReviewed: true });
      setForm({ rating: 0, reviewText: "" });
      onSuccess?.();
    },

    onError: () => toast.error("Failed to add review")
  });

  const addReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.rating <= 0 || form.reviewText.length === 0 || !productId) return;
    addReviewMutation.mutate(productId);
  };

  const fieldChangeHandle = (value: string, name: string) => {
    setError({ ...error, [name]: false });
    setForm({ ...form, [name]: value });
  };
  return (
    <form onSubmit={addReviewSubmit}>
      <RatingStars isEditable rate={form.rating} onChange={(value) => setForm({ ...form, rating: value })} />
      <div className="text-end text-[12px] text-gray-400">{form.reviewText.length}/150</div>
      <label className="hidden" htmlFor="add-review">
        {t("addReview")}
      </label>
      <textarea
        className="w-full rounded-md border p-2.5 focus:border-primary focus:outline-none focus:ring-0"
        id="add-review"
        maxLength={150}
        name="reviewText"
        rows={4}
        value={form.reviewText}
        onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
      ></textarea>
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error.reviewText}</div>

      <div className="flex justify-end">
        <Button className="bg-primary text-white" isLoading={addReviewMutation.isPending} type="submit">
          {t("addReview")}
        </Button>
      </div>
    </form>
  );
}
