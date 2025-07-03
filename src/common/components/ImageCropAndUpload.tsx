import React, { useState } from "react";
import { uploadImage } from "@/common/services/upload.service";
import Cropper, { Area } from "react-easy-crop";
import { useMutation } from "@tanstack/react-query";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useTranslation } from "@/common/context/Translation";
import { Button } from "@/common/components/ui/button";
import { getCroppedImg } from "@/common/lib/image-croping-helpers";

type Props = {
  onSuccess: (image: string) => void;
  imageSrc: string;
  onCancel: () => void;
  aspectRatio?: number;
};

export default function ImageCropAndUpload({ onSuccess, imageSrc, onCancel }: Props) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState<string | false>(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const uploadImageMutation = useMutation({
    mutationKey: ["upload"],
    mutationFn: (formData: FormData) => uploadImage(formData),
    onSuccess: (data) => onSuccess(data.imageUrl),
    onError: () => setImageError(t("upload.unableToUpload"))
  });

  const handleCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const data = new FormData();
    data.append("image", croppedBlob);
    uploadImageMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-96 w-full bg-black">
        <Cropper
          aspect={1}
          crop={crop}
          image={imageSrc}
          maxZoom={3}
          minZoom={1}
          zoom={zoom}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Zoom</span>
        <input
          className="w-full"
          max={3}
          min={1}
          step={0.01}
          type="range"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <span className="text-xs text-muted-foreground">{zoom.toFixed(2)}x</span>
      </div>

      {imageError && <div className="text-sm text-red-500">{imageError}</div>}

      <SubmitButton
        className="bg-primary text-white"
        isLoading={uploadImageMutation.isPending}
        onClick={(e) => {
          e.preventDefault();
          handleCropConfirm();
        }}
      >
        {t("crop")}
      </SubmitButton>

      <Button
        className="ms-2"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          onCancel();
        }}
      >
        {t("cancel")}
      </Button>
    </div>
  );
}
