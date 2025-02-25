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

        setCountries: async () => set({ countries: await getCountries() })
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);
