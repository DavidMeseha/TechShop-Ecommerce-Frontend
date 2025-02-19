import axios from "@/lib/axios";

function uploadImage(formData: FormData) {
  return axios
    .post<{ imageUrl: string }>("/api/common/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => res.data);
}

export default uploadImage;
