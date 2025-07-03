import adminApi from "@/admin/services/api/adminApi.config";
import api from "@/web/services/api/api.config";

export const resetAxiosIterceptor = (token: string) => {
  api.interceptors.request.clear();
  adminApi.interceptors.request.clear();
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  adminApi.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};
