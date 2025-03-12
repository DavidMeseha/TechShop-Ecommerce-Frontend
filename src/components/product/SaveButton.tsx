"use client";

import React, { useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";
import useSave from "@/hooks/useSave";

type Props = {
  productId: string;
  isSaved: boolean;
  savesCount: number;
};

export default React.memo(function SaveProductButton({ productId, isSaved, savesCount }: Props) {
  const [save, setSave] = useState(() => ({ state: isSaved, count: savesCount }));

  const handleSave = useSave({
    productId,
    onClick: (shouldSave) => setSave({ state: shouldSave, count: save.count + (shouldSave ? 1 : -1) }),
    onError: (shouldSave) => setSave({ state: !shouldSave, count: save.count + (!shouldSave ? 1 : -1) })
  });

  const handleSaveAction = () => handleSave(!save.state);
  return (
    <div aria-label="Like Product" className="fill-black text-center">
      <button className="block rounded-full bg-gray-200 p-2" onClick={handleSaveAction}>
        <BsBookmarkFill
          className={`transition-all ${save.state ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </button>
      <span className="text-blend text-sm font-semibold">{save.count}</span>
    </div>
  );
});
