import React from "react";
import OverlayLayout from "./OverlayLayout";
import { useOverlayStore } from "@/stores/overlayStore";
import NewAddressPage from "../pages/NewAddressPage";

export default function AddNewAddress() {
  const setIsAddAddressOpen = useOverlayStore((state) => state.setIsAddAddressOpen);
  return (
    <OverlayLayout className="max-h-none" close={() => setIsAddAddressOpen(false)} title="Add New Address">
      <NewAddressPage onFinish={() => setIsAddAddressOpen(false)} />
    </OverlayLayout>
  );
}
