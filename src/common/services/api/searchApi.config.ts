import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_SEARCH_API_URL;

const searchApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

export default searchApi;
