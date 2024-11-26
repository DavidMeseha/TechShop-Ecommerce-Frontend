import { ChangeEvent, useRef, useState } from "react";
import { CircleStencil, Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import FormTextInput from "../FormTextInput";
import { BsPencil } from "react-icons/bs";
import { useGeneralStore } from "@/stores/generalStore";
import Image from "next/image";
import OverlayLayout from "./OverlayLayout";
import { useTranslation } from "@/context/Translation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import RadioGroup from "../RadioGroup";
import DateDropdownNumbers from "../DateDropdownNumbers";
import { toast } from "react-toastify";
import Button from "../Button";
import { queryClient } from "../layout/MainLayout";
import { FieldError, UserProfile } from "@/types";
import { useUserStore } from "@/stores/userStore";

interface ProfileErrors {
  email: FieldError;
  gender: FieldError;
  username: FieldError;
  firstName: FieldError;
  lastName: FieldError;
  dateOfBirthDay: FieldError;
  dateOfBirthMonth: FieldError;
  dateOfBirthYear: FieldError;
  phone: FieldError;
  avatar: FieldError;
}

const today = new Date();

export default function EditProfileOverlay() {
  const { setIsEditProfileOpen } = useGeneralStore();
  const { user } = useUserStore();
  const { t } = useTranslation();
  const cropperRef = useRef<CropperRef>(null);
  const [cropping, setCropping] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    gender: "",
    firstName: "",
    lastName: "",
    dateOfBirthDay: today.getDay(),
    dateOfBirthMonth: today.getMonth(),
    dateOfBirthYear: today.getFullYear(),
    phone: "",
    imageUrl: "/images/placeholder.png"
  });
  const [error, setError] = useState<ProfileErrors>({
    email: false,
    gender: false,
    username: false,
    firstName: false,
    lastName: false,
    dateOfBirthDay: false,
    dateOfBirthMonth: false,
    dateOfBirthYear: false,
    phone: false,
    avatar: false
  });

  const userInfoQuery = useQuery({
    queryKey: ["userInfo"],
    queryFn: () =>
      axios.get<UserProfile>("/api/user/info").then((res) => {
        setForm({ ...res.data });
        return res.data;
      })
  });

  const userInfoMutation = useMutation({
    mutationKey: ["updateUserInfo"],
    mutationFn: () => axios.put("/api/user/info", { ...form }),
    onSuccess: () => {
      toast.success("Profile Updated Successfuly");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setIsEditProfileOpen(false);
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post<{ imageUrl: string }>("/api/common/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }),

    onSuccess: (data) => {
      console.log(data.data.imageUrl);
      setForm({ ...form, imageUrl: data.data.imageUrl });
      setCropping(null);
    }
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setCropping(reader.result?.toString() || ""));
    reader.readAsDataURL(e.target.files[0]);
  };

  const validate = () => {
    let isError = false;
    let errors = { ...error };

    if (!form.firstName) {
      errors = { ...errors, firstName: t("auth.nameRequired") };
      isError = true;
    }
    if (!form.lastName) {
      errors = { ...errors, lastName: t("auth.nameRequired") };
      isError = true;
    }
    if (!form.email) {
      errors = { ...errors, email: t("auth.emailRequired") };
      isError = true;
    }
    if (!form.phone) {
      errors = { ...errors, phone: t("auth.passwordRequired") };
      isError = true;
    }

    setError({ ...errors });
    return isError;
  };

  const fieldChangeHandle = (value: string, name: string) => {
    setError({ ...error, [name]: false });
    setForm({ ...form, [name]: value });
  };

  const updateUserInfo = async () => {
    if (validate()) return;
    if (!user) return;

    userInfoMutation.mutate();
  };

  const cropAndUpdateImage = async () => {
    if (!user) return;
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
      setError({ ...error, avatar: false });
    }
  };

  return (
    <>
      <OverlayLayout
        className="max-w-3xl"
        close={() => setIsEditProfileOpen(false)}
        isLoading={userInfoMutation.isPending || userInfoQuery.isFetching}
        title="Edit Profile"
      >
        {!cropping ? (
          <>
            <div className="flex justify-center border-b pb-4">
              <label className="relative cursor-pointer" htmlFor="image">
                <Image
                  alt={user?.firstName || "My profile"}
                  className="h-24 w-24 rounded-full"
                  height={95}
                  src={form.imageUrl}
                  width={95}
                />

                <div
                  aria-label="Edit Profile"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full border border-gray-300 bg-white p-1 shadow-xl"
                >
                  <BsPencil className="ml-0.5" size="17" />
                </div>
              </label>
              <input
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                id="image"
                type="file"
                onChange={handleFileChange}
              />
            </div>

            <div className="mt-1.5 w-full border-b p-2">
              <FormTextInput
                error={error.firstName}
                label="First Name"
                name="firstName"
                placeholder="First Name"
                type="text"
                value={form.firstName}
                onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
              />
              <FormTextInput
                error={error.lastName}
                label="Last Name"
                name="lastName"
                placeholder="Last Name"
                type="text"
                value={form.lastName}
                onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
              />
              <RadioGroup
                title="Gender"
                value={form.gender}
                options={[
                  { name: "Male", value: "male" },
                  { name: "Female", value: "female" }
                ]}
                onChange={(value) => setForm({ ...form, gender: value })}
              />
              <DateDropdownNumbers
                changeDay={(value) => setForm({ ...form, dateOfBirthDay: value })}
                changeMonth={(value) => setForm({ ...form, dateOfBirthMonth: value })}
                changeYear={(value) => setForm({ ...form, dateOfBirthYear: value })}
                className="mb-4"
                day={form.dateOfBirthDay ?? today.getDay()}
                month={form.dateOfBirthMonth ?? today.getMonth()}
                title="Date Of Birth"
                year={form.dateOfBirthYear ?? today.getFullYear()}
              />
              <FormTextInput
                error={error.phone}
                label="Phone Number"
                name="phone"
                placeholder="Phone Number"
                type="text"
                value={form.phone}
                onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
              />
            </div>
          </>
        ) : (
          <div className="circle-stencil bg-black">
            <Cropper
              className="rounded-sm"
              ref={cropperRef}
              src={cropping}
              stencilComponent={CircleStencil}
              stencilProps={{ aspectRatio: 9 / 18 }}
            />
          </div>
        )}

        <div className="border-t border-t-gray-300 p-5">
          <div className="ms-auto">
            {!cropping ? (
              <>
                <Button className="me-2 border hover:bg-gray-100" onClick={() => setIsEditProfileOpen(false)}>
                  Cancel
                </Button>

                <Button
                  className="bg-primary text-white"
                  isLoading={userInfoMutation.isPending}
                  onClick={() => updateUserInfo()}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button className="me-2 border hover:bg-gray-100" onClick={() => setCropping(null)}>
                  Cancel
                </Button>

                <Button
                  className="bg-primary text-white"
                  isLoading={uploadImageMutation.isPending}
                  onClick={() => cropAndUpdateImage()}
                >
                  Apply
                </Button>
              </>
            )}
          </div>
        </div>
      </OverlayLayout>
    </>
  );
}
