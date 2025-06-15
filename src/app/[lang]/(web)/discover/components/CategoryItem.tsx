import { LocalLink } from "@/components/util/LocalizedNavigation";
import { useTranslation } from "@/context/Translation";
import { ICategory } from "@/types";

type Props = {
  category: ICategory;
};

export default function CategoryItem({ category }: Props) {
  const { t } = useTranslation();

  return (
    <li className="mx-2 my-2 flex items-center justify-between rounded-md border px-4 py-2">
      <div className="flex items-center gap-3">
        <LocalLink className="font-bold hover:underline" href={`/category/${category.seName}`}>
          {category.name}
        </LocalLink>
      </div>
      <p className="text-gray-400">
        {t("discover.products")}: {category.productsCount || 0}
      </p>
    </li>
  );
}
