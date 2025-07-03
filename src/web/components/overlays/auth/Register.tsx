import React from "react";
import OverlayLayout from "@/common/layouts/OverlayLayout";
import { useOverlayStore } from "@/web/stores/overlayStore";
import RegisterPageForm from "@/web/components/forms/RegisterForm";

export default function Register() {
  const setIsRegisterOpen = useOverlayStore((state) => state.setIsRegisterOpen);

  return (
    <OverlayLayout close={() => setIsRegisterOpen(false)}>
      <RegisterPageForm />
    </OverlayLayout>
  );
}
