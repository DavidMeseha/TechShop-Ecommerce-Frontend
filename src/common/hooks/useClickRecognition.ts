"use client";

import { RefObject, useEffect, useCallback } from "react";

interface ClickRecognitionProps {
  onOutsideClick: () => void;
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}

export default function useClickRecognition({ onOutsideClick, containerRef, enabled = true }: ClickRecognitionProps) {
  const handleOutsideClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!containerRef?.current || !event.target) return;

      const isOutside = !containerRef.current.contains(event.target as Node);
      if (isOutside) {
        onOutsideClick();
      }
    },
    [containerRef, onOutsideClick]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mouseup", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [enabled, handleOutsideClick]);
}
