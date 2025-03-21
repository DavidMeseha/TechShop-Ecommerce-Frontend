import React from "react";
import OverlayLayout from "../layouts/OverlayLayout";
import { useProductStore } from "@/stores/productStore";
import AddReviewForm from "../forms/AddReviewForm";

export default function AddReviewOverlay() {
  const productId = useProductStore((state) => state.productIdToOverlay);
  const setIsAddReviewOpen = useProductStore((state) => state.setIsAddReviewOpen);

  return (
    <OverlayLayout className="max-h-none" close={() => setIsAddReviewOpen(false)} title="Add Review">
      <AddReviewForm productId={productId ?? ""} onSuccess={() => setIsAddReviewOpen(false)} />
    </OverlayLayout>
  );
}
