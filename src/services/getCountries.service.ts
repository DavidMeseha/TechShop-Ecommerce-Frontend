import axios from "@/lib/axios";

const getCountries = async () => {
  try {
    const ids = await axios.get<{ name: string; code: string; _id: string }[]>(`/api/v2/common/countries`);
    return ids.data;
  } catch {
    return [];
  }
};

export async function citiesInCountry(countryId: string) {
  return axios
    .get<{ name: string; code: string; _id: string }[]>(`/api/v2/common/cities/${countryId}`)
    .then((res) => res.data);
}

export default getCountries;
