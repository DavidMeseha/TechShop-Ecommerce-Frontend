import Image from "next/image";
import React, { HTMLProps } from "react";
import { BsPencil } from "react-icons/bs";
import ProfileImageLoading from "./ProfileImageLoading";

type Props = HTMLProps<HTMLInputElement> & {
  imageUrl: string;
  isLodaing: boolean;
  imageAlt: string;
};

export default function ProfileImageInput({ imageUrl, isLodaing, imageAlt, ...props }: Props) {
  return (
    <div className="flex justify-center border-b pb-4">
      <label className="relative h-24 w-24 cursor-pointer" htmlFor="image">
        {isLodaing || !imageUrl ? (
          <ProfileImageLoading />
        ) : (
          <Image alt={imageAlt} className="h-24 w-24 rounded-full" height={95} src={imageUrl} width={95} />
        )}

        <div
          aria-label="Edit Profile"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full border border-gray-300 bg-white p-1 shadow-xl"
        >
          <BsPencil className="ml-0.5" size="17" />
        </div>
      </label>
      <input accept="image/png, image/jpeg, image/jpg" className="hidden" id="image" type="file" {...props} />
    </div>
  );
}
