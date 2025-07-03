import { PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";
import { IFullProduct, IVendor } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

type ProductWithoutVendor = Omit<Partial<IFullProduct>, "vendor">;
interface PartialProduct extends ProductWithoutVendor {
  vendor?: Partial<IVendor>;
}

export default function useAdjustProductsQueries(productId: string) {
  const queryClient = useQueryClient();

  //just not to fetch all product requests once again
  const adjustQueriesCash = (fieldsToChange: PartialProduct) => {
    queryClient.setQueriesData(
      { queryKey: [PRODUCTS_QUERY_KEY] }, // Match any query key starting with "products"
      (oldData: IFullProduct[] | { data: IFullProduct[] } | { pages: { data: IFullProduct[] }[] }) => {
        if (!oldData) return;
        if (Array.isArray(oldData)) {
          return oldData.map((product) => (product._id === productId ? { ...product, ...fieldsToChange } : product));
        } else if ("data" in oldData) {
          return {
            ...oldData,
            data: oldData.data.map((product) =>
              product._id === productId ? { ...product, ...fieldsToChange } : product
            )
          };
        } else if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((product) =>
                product._id === productId ? { ...product, ...fieldsToChange } : product
              )
            }))
          };
        }
        return oldData;
      }
    );
  };

  return adjustQueriesCash;
}
