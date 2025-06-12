import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

export const resetAxiosIterceptor = (token: string) => {
  api.interceptors.request.clear();
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default api;
