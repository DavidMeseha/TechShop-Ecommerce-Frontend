"use client";

import NewAddressForm from "@/components/forms/NewAddressForm";
import { useTranslation } from "@/context/Translation";
import { useRouter } from "@bprogress/next";

export default function NewAddressPage() {
  const router = useRouter();
  const { lang } = useTranslation();
  const onEnd = () => router.push(`/${lang}/user/addresses`);

  return <NewAddressForm onCancel={onEnd} onFinish={onEnd} />;
}
