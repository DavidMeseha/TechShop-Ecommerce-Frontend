import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASEURL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

export default api;
