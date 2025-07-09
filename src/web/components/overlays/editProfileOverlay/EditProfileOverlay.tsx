// Update imports
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/web/schemas/valdation";
import OverlayLayout from "@/common/layouts/OverlayLayout";
import { useTranslation } from "@/common/context/Translation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useUserStore } from "@/common/stores/userStore";
import { getUserInfo, updateUserInfo } from "@/web/services/user.service";
import { useOverlayStore } from "@/common/stores/overlayStore";
import ProfileImageInput from "./ProfileImageInput";
import EditUserInfoFormInputs from "./EditUserInfoFormInputs";
import ImageCrop from "@/common/components/ImageCropAndUpload";
import { CHECK_TOKEN_QUERY_KEY, INFO_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";
import { UserInfoForm } from "@/web/services/types";

export default function EditProfileOverlay() {
  const todyRef = useRef(new Date());
  const setIsEditProfileOpen = useOverlayStore((state) => state.setIsEditProfileOpen);
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const formHook = useForm<UserInfoForm>({
    resolver: zodResolver(editProfileSchema(t)),
    defaultValues: {
      imageUrl: user?.imageUrl,
      dateOfBirthDay: todyRef.current.getDay(),
      dateOfBirthMonth: todyRef.current.getMonth(),
      dateOfBirthYear: todyRef.current.getFullYear()
    }
  });

  const form = formHook.watch();
  const errors = formHook.formState.errors;

  const userInfoQuery = useQuery({
    queryKey: [USER_QUERY_KEY, INFO_QUERY_KEY],
    queryFn: () => getUserInfo()
  });

  useEffect(() => {
    const data = userInfoQuery.data;
    if (data) {
      Object.keys(data).forEach((key) => {
        formHook.setValue(key as keyof UserInfoForm, data[key as keyof UserInfoForm]);
      });
    }
  }, [userInfoQuery.data]);

  const userInfoMutation = useMutation({
    mutationKey: ["updateUserInfo"],
    mutationFn: (form: UserInfoForm) => updateUserInfo(form),
    onSuccess: () => {
      setIsEditProfileOpen(false);
      toast.success("Profile Updated Successfully");
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(INFO_QUERY_KEY) });
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(CHECK_TOKEN_QUERY_KEY) });
    }
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageToCrop(reader.result?.toString() || ""));
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateUserInfoSubmit = (form: UserInfoForm) => userInfoMutation.mutate(form);

  const onImageUpload = (imageUrl: string) => {
    formHook.setValue("imageUrl", imageUrl);
    setImageToCrop(null);
  };

  return (
    <OverlayLayout
      close={() => setIsEditProfileOpen(false)}
      isLoading={userInfoMutation.isPending || userInfoQuery.isFetching}
      title="Edit Profile"
    >
      {!imageToCrop ? (
        <form onSubmit={formHook.handleSubmit(updateUserInfoSubmit)}>
          <ProfileImageInput
            imageAlt={user?.firstName ?? "My Profile"}
            imageUrl={form.imageUrl}
            isLodaing={userInfoQuery.isPending || !form.imageUrl}
            onChange={handleFileChange}
          />

          <EditUserInfoFormInputs clearErrors={formHook.clearErrors} errors={errors} register={formHook.register} />

          <div className="py-4">
            <SubmitButton className="me-2 border hover:bg-gray-100" onClick={() => setIsEditProfileOpen(false)}>
              {t("cancel")}
            </SubmitButton>
            <SubmitButton className="bg-primary text-white" isLoading={userInfoMutation.isPending} type="submit">
              {t("save")}
            </SubmitButton>
          </div>
        </form>
      ) : (
        <ImageCrop imageSrc={imageToCrop} onCancel={() => setImageToCrop(null)} onSuccess={onImageUpload} />
      )}
    </OverlayLayout>
  );
}
