"use client";

import React, { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { avilableVendorSename } from "@/admin/services/sename-sku";
import { registerVendor, RegisterVendorBody } from "@/admin/services/register-vendor";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import FormInput from "@/common/components/ui/extend/FormInput";
import { FieldError } from "@/types";
import { useRouter } from "@bprogress/next";
import useDebounce from "@/common/hooks/useDebounce";
import ImageInput from "@/common/components/ui/extend/ImageInput";
import ImageCropAndUpload from "@/common/components/ImageCropAndUpload";
import Image from "next/image";
import { X } from "lucide-react";
import { isAxiosError } from "axios";

export default function RegisterVendorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<FieldError>();
  const [isLoading, setLoading] = useState(false);

  const debouncedInputChange = useDebounce((value: string) => {
    setName(value);
  });

  const seNameQuery = useQuery({
    queryKey: ["gen-sku", name],
    queryFn: () => avilableVendorSename({ name: name }),
    enabled: !!name
  });
  const seName = seNameQuery.data?.seName ?? "";

  const submitVendorMutation = useMutation({
    mutationFn: (props: RegisterVendorBody) => registerVendor({ ...props }),
    onSuccess: () => router.push("/admin/products"),
    onError: (err) => {
      setLoading(false);
      if (isAxiosError(err)) {
        if (err.response?.status === 409) return setError("Vendor Could Be already registered");
      }
      setError("Could not register your vendor");
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const formSubmitHandle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.length) return setError("You must have a shop name");
    if (name.length < 5) return setError("Shop Name Must Be more than 4 characters");
    // if (!image) return setError("You must Add an image");
    setLoading(true);
    submitVendorMutation.mutate({ image: "", name, seName });
  };
  return (
    <div className="flex items-center justify-center px-4 pt-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-xl border p-8 shadow-lg">
        <div className="flex justify-center">
          {imageSrc ? (
            <div className="w-full">
              <ImageCropAndUpload
                imageSrc={imageSrc}
                onCancel={() => setImageSrc(null)}
                onSuccess={(imageUrl) => {
                  setImage(imageUrl);
                  setImageSrc(null);
                }}
              />
            </div>
          ) : image ? (
            <div className="group relative">
              <Image
                alt="uploaded"
                className="h-32 w-32 rounded border object-cover"
                height={128}
                src={image}
                width={128}
              />
              <button
                className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-white opacity-80 hover:opacity-100"
                type="button"
                onClick={() => setImage(null)}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <ImageInput onChange={handleFileChange} />
          )}
        </div>
        <form className="space-y-2" onSubmit={formSubmitHandle}>
          <FormInput
            error={error}
            label={"Your Shop's Name"}
            placeholder={"Ex. HP, Dell, Nokia, Samsung, ect.... "}
            type="text"
            onChange={(e) => debouncedInputChange(e.currentTarget.value)}
          />
          <p className="text-xs text-muted-foreground">SeName: {seName}</p>
          <div>
            <SubmitButton
              className="w-full bg-primary text-primary-foreground"
              isLoading={submitVendorMutation.isPending || isLoading}
              type="submit"
            >
              Register
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
