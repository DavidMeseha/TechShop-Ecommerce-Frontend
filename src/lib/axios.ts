import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

export const resetAxiosIterceptor = (token: string) => {
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default axiosInstance;
