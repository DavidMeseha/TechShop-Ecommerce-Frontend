import { Plus } from "lucide-react";
import React, { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function ImageInput(props: Props) {
  return (
    <label
      className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary bg-muted transition-colors hover:bg-primary-100"
      htmlFor="image-upload"
    >
      <Plus className="text-primary" size={32} />
      <span className="mt-2 text-sm text-primary">Add Image</span>
      <input accept="image/*" className="hidden" id="image-upload" type="file" {...props} />
    </label>
  );
}
