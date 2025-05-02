import React from "react";
import OverlayLayout from "@/components/layouts/OverlayLayout";
import { useOverlayStore } from "@/stores/overlayStore";
import LoginPageForm from "@/components/forms/LoginPageForm";

export default function Login() {
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);

  return (
    <OverlayLayout close={() => setIsLoginOpen(false)}>
      <LoginPageForm />
    </OverlayLayout>
  );
}
