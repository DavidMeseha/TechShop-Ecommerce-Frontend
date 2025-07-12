import axios from "@/common/services/api/api.config";

export async function uploadImage(formData: FormData) {
  return axios
    .post<{ imageUrl: string }>("/api/v2/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => res.data);
}
