import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
  timeout: 10000
});
