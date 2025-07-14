"use client";

import NewAddressForm from "@/web/components/forms/NewAddressForm";
import { useTranslation } from "@/common/context/Translation";
import { useRouter } from "@bprogress/next";

export default function NewAddressPage() {
  const router = useRouter();
  const { lang } = useTranslation();
  const onEnd = () => router.push(`/${lang}/user/addresses`);

  return <NewAddressForm onCancel={onEnd} onFinish={onEnd} />;
}
