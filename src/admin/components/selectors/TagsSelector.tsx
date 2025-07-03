import TagsInput from "@/common/components/ui/extend/TagsInput";
import useDebounce from "@/common/hooks/useDebounce";
import { findTags } from "@/admin/services/find";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

type Props = {
  onChange: (tags: string[]) => void;
  tags: string[];
};

export default function TagsSelector({ tags, onChange }: Props) {
  const [tagInput, setTagInput] = useState("");

  const tagsQuery = useQuery({
    queryKey: ["tags-search", tagInput],
    queryFn: () => findTags({ query: tagInput }),
    enabled: !!tagInput
  });
  const options = tagsQuery.data ?? [];

  const handleAddTag = (value: string) => {
    onChange([...tags, value]);
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    const tempTags = [...tags];
    tempTags.splice(index, 1);
    onChange([...tempTags]);
  };

  const handlTagTextChange = useDebounce((value: string) => setTagInput(value));

  return (
    <TagsInput
      autoComplete={options.map((t) => t.seName)}
      isLoading={tagsQuery.isLoading}
      tags={tags}
      onTagConfirm={handleAddTag}
      onTagRemove={handleRemoveTag}
      onTagSelect={handleAddTag}
      onTagTextChange={handlTagTextChange}
    />
  );
}
