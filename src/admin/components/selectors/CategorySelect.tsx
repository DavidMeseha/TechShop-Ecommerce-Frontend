import { DropdownInputSearch } from "@/common/components/ui/extend/DropdownInputSearch";
import { CATEGORIES_QUERY_KEY } from "@/common/constants/query-keys";
import useDebounce from "@/common/hooks/useDebounce";
import { findCategories } from "@/admin/services/find";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

type Props = {
  className?: string;
  selectedCategoryId: string;
  preSelectedCategoryName?: string;
  canUseAllOption?: boolean;
  onChange: (categoryId: string) => void;
};

export default function CategorySelect({
  selectedCategoryId,
  preSelectedCategoryName,
  onChange,
  className = "",
  canUseAllOption = false
}: Props) {
  const [categoryQuery, setCategoryQuery] = useState("");

  const categoriesQuery = useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, categoryQuery],
    queryFn: () => findCategories({ query: categoryQuery })
  });
  const categories = categoriesQuery.data ?? [];
  const categoryQueryChangeHandle = useDebounce(setCategoryQuery);
  const options = [...categories.map((category) => ({ value: category._id, label: category.name }))];
  if (canUseAllOption) options.push({ label: "All Categories", value: "" });

  return (
    <DropdownInputSearch
      className={className}
      initialName={preSelectedCategoryName}
      isAsync
      isPending={categoriesQuery.isLoading}
      options={options}
      placeholder="Category..."
      value={selectedCategoryId}
      onSearchChange={categoryQueryChangeHandle}
      onValueChange={(value) => onChange(value)}
    />
  );
}
