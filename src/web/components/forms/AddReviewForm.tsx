import { FieldError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import React, { useState } from "react";
import RatingStars from "@/common/components/ui/extend/RatingStars";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useTranslation } from "@/common/context/Translation";
import useAdjustProductsQueries from "@/common/hooks/useAdjustProductsQueries";
import { addReview } from "@/web/services/userActions.service";
import ErrorMessage from "@/common/components/ui/extend/ErrorMessage";

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
  const [error, setError] = useState<FormError>({ reviewText: null, rating: null });
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
    if (!productId) return;

    const errors = { ...error };
    if (form.rating <= 0) errors.rating = "You must add a rate more than 0";
    if (form.reviewText.length === 0) errors.reviewText = "You must add some feedback";
    if (errors.rating || errors.reviewText) return setError({ ...errors });

    addReviewMutation.mutate(productId);
  };

  const fieldChangeHandle = (value: string, name: string) => {
    setError({ ...error, [name]: null });
    setForm({ ...form, [name]: value });
  };

  return (
    <form onSubmit={addReviewSubmit}>
      <RatingStars isEditable rate={form.rating} onChange={(value) => setForm({ ...form, rating: value })} />
      <ErrorMessage error={error.rating} />

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
      <ErrorMessage error={error.reviewText} />

      <div className="flex justify-end">
        <SubmitButton className="bg-primary text-white" isLoading={addReviewMutation.isPending} type="submit">
          {t("addReview")}
        </SubmitButton>
      </div>
    </form>
  );
}
