"use client";

import React from "react";
import Button from "./Button";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button isLoading={pending} {...props}>
      {children}
    </Button>
  );
}
