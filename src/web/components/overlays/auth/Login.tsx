import React from "react";
import OverlayLayout from "@/common/layouts/OverlayLayout";
import { useOverlayStore } from "@/common/stores/overlayStore";
import LoginPageForm from "@/web/components/forms/LoginForm";

export default function Login() {
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);

  return (
    <OverlayLayout close={() => setIsLoginOpen(false)}>
      <LoginPageForm />
    </OverlayLayout>
  );
}
