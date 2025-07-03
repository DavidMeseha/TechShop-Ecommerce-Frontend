import React from "react";
import OverlayLayout from "@/common/layouts/OverlayLayout";
import { useOverlayStore } from "@/web/stores/overlayStore";
import NewAddressForm from "../forms/NewAddressForm";

export default function AddNewAddress() {
  const setIsAddAddressOpen = useOverlayStore((state) => state.setIsAddAddressOpen);

  return (
    <OverlayLayout className="max-h-none" close={() => setIsAddAddressOpen(false)} title="Add New Address">
      <NewAddressForm onCancel={() => setIsAddAddressOpen(false)} onFinish={() => setIsAddAddressOpen(false)} />
    </OverlayLayout>
  );
}
