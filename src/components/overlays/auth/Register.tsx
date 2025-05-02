import React from "react";
import OverlayLayout from "@/components/layouts/OverlayLayout";
import { useOverlayStore } from "@/stores/overlayStore";
import RegisterPageForm from "@/components/forms/RegisterPageForm";

export default function Register() {
  const setIsRegisterOpen = useOverlayStore((state) => state.setIsRegisterOpen);

  return (
    <OverlayLayout close={() => setIsRegisterOpen(false)}>
      <RegisterPageForm />
    </OverlayLayout>
  );
}
