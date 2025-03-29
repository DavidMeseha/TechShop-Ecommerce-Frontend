import { IFullProduct, IVendor } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

export default function useAdjustVendorsQueries(vendorId: string) {
  const queryClient = useQueryClient();

  //just not to fetch all vendor requests once again
  const adjustVendorsQueries = (fieldsToChange: Partial<IVendor>) => {
    queryClient.setQueriesData(
      { queryKey: ["vendors"] },
      (oldData: IVendor[] | { data: IVendor[] } | { pages: { data: IVendor[] }[] }) => {
        if (!oldData) return;
        if (Array.isArray(oldData)) {
          return oldData.map((vendor) => (vendor._id === vendorId ? { ...vendor, ...fieldsToChange } : vendor));
        } else if ("data" in oldData) {
          return {
            ...oldData,
            data: oldData.data.map((vendor) => (vendor._id === vendorId ? { ...vendor, ...fieldsToChange } : vendor))
          };
        } else if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((vendor) => (vendor._id === vendorId ? { ...vendor, ...fieldsToChange } : vendor))
            }))
          };
        }
        return oldData;
      }
    );
  };

  const adjustProductsQueries = (fieldsToChange: Partial<IVendor>) => {
    queryClient.setQueriesData(
      { queryKey: ["products"] }, // Match any query key starting with "products"
      (oldData: IFullProduct[] | { data: IFullProduct[] } | { pages: { data: IFullProduct[] }[] }) => {
        if (!oldData) return;
        if (Array.isArray(oldData)) {
          return oldData.map((product) =>
            product.vendor._id === vendorId ? { ...product, vendor: { ...product.vendor, ...fieldsToChange } } : product
          );
        } else if ("data" in oldData) {
          return {
            ...oldData,
            data: oldData.data.map((product) =>
              product.vendor._id === vendorId
                ? { ...product, vendor: { ...product.vendor, ...fieldsToChange } }
                : product
            )
          };
        } else if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((product) =>
                product.vendor._id === vendorId
                  ? { ...product, vendor: { ...product.vendor, ...fieldsToChange } }
                  : product
              )
            }))
          };
        }
        return oldData;
      }
    );
  };

  return { adjustProductsQueries, adjustVendorsQueries };
}
