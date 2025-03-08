import getCountries from "@/services/getCountries.service";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

export interface AppStore {
  countries: { name: string; _id: string; code: string }[];
  setCountries: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        countries: [],

        setCountries: async () => {
          const { countries } = useAppStore.getState();
          if (countries.length < 0) {
            const fetchedCountries = await getCountries();
            set({ countries: fetchedCountries });
          }
        }
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);
