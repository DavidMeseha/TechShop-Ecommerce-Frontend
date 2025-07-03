import React, { memo, useState } from "react";
import { X } from "lucide-react";
import ImageCropAndUpload from "@/common/components/ImageCropAndUpload";
import Image from "next/image";
import ImageInput from "@/common/components/ui/extend/ImageInput";

interface ImageInputProps {
  images: string[];
  onChange: (paths: string[]) => void;
}

const ProductImageInput = memo(({ images, onChange }: ImageInputProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleRemove = (idx: number) => {
    const newArr = images.slice();
    newArr.splice(idx, 1);
    onChange(newArr);
  };

  return (
    <div>
      {imageSrc ? (
        <ImageCropAndUpload
          imageSrc={imageSrc}
          onCancel={() => setImageSrc(null)}
          onSuccess={(imageUrl) => {
            const temp = [...images];
            temp.push(imageUrl);
            onChange(temp);
            setImageSrc(null);
          }}
        />
      ) : (
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <div className="group relative" key={img}>
              <Image
                alt="uploaded"
                className="h-32 w-32 rounded border object-cover"
                height={128}
                src={img}
                width={128}
              />
              <button
                className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-white opacity-80 hover:opacity-100"
                type="button"
                onClick={() => handleRemove(idx)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <ImageInput onChange={handleFileChange} />
        </div>
      )}

      {imageSrc && (
        <div className="mb-2 flex flex-wrap justify-center gap-2">
          {images.map((img, idx) => (
            <div className="group relative" key={img}>
              <Image
                alt="uploaded"
                className="h-20 w-20 rounded border object-cover"
                height={80}
                src={img}
                width={80}
              />
              <button
                className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-white opacity-80 hover:opacity-100"
                type="button"
                onClick={() => handleRemove(idx)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ProductImageInput.displayName = "ProductImageInput";
export default ProductImageInput;
