import api from "@/common/services/api/searchApi.config";

type SearchResponseItem = {
  item: { _id: string; name: string; seName: string; imageUrl: string };
  type: "product" | "category" | "vendor" | "tag";
};

export async function find(props: {
  categories?: boolean;
  vendors?: boolean;
  tags?: boolean;
  products?: boolean;
  query: string;
}) {
  return api
    .post<SearchResponseItem[]>("", {
      searchText: props.query,
      ...props
    })
    .then((data) => data.data);
}
