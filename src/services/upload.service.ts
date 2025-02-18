import axios from "@/lib/axios";

function upload(formData: FormData) {
  return axios.post<{ imageUrl: string }>("/api/common/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export default upload;
