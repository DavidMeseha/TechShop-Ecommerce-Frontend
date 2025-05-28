import React, { useRef, useState } from "react";
import { uploadImage } from "@/services/upload.service";
import { CircleStencil, Cropper, CropperRef } from "react-advanced-cropper";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/context/Translation";

type Props = {
  onSuccess: (image: string) => void;
  imageSrc: string;
  onCancel: () => void;
};

export default function ImageCropAndUpload({ onSuccess, imageSrc, onCancel }: Props) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState<string | false>(false);
  const cropperRef = useRef<CropperRef>(null);

  const uploadImageMutation = useMutation({
    mutationKey: ["upload"],
    mutationFn: (formData: FormData) => uploadImage(formData),
    onSuccess: (data) => onSuccess(data.imageUrl)
  });

  const cropAndUpdateImage = async () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "croppedImg.webp", { type: blob.type });
          const formData = new FormData();
          formData.append("image", file);
          uploadImageMutation.mutate(formData);
        }
      }, "image/webp");
      setImageError(false);
    }
  };

  return (
    <>
      <div className="circle-stencil border-b bg-black">
        <Cropper
          className="rounded-sm"
          ref={cropperRef}
          src={imageSrc}
          stencilComponent={CircleStencil}
          stencilProps={{ aspectRatio: 9 / 18 }}
        />
      </div>

      {imageError && <div className="text-sm text-red-500">{imageError}</div>}

      <Button className="me-2 border hover:bg-gray-100" onClick={onCancel}>
        {t("cancel")}
      </Button>

      <Button
        className="bg-primary text-white"
        isLoading={uploadImageMutation.isPending}
        onClick={() => cropAndUpdateImage()}
      >
        {t("crop")}
      </Button>
    </>
  );
}
