import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL;

export default axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});
