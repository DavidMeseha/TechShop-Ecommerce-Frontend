import axios from "@/lib/axiosInstanceNew";

const getCountries = async () => {
  try {
    const ids = await axios.get<{ name: string; code: string; _id: string }[]>(`/api/common/countries`);
    return ids.data;
  } catch {
    return [];
  }
};

export default getCountries;
