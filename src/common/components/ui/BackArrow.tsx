"use client";

import React, { useEffect, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

type Props = {
  onClick: () => void;
  color?: string;
};

export default function BackArrow({ onClick, color }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return loading ? null : (
    <button aria-label="back" onClick={onClick}>
      {document.dir === "rtl" ? <BsArrowRight color={color} size={25} /> : <BsArrowLeft color={color} size={25} />}
    </button>
  );
}
