import React, { useEffect, useRef, useState } from "react";
import { Input } from "../input";
import { Button } from "../button";
import { Badge } from "../badge";
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { cn } from "@/common/lib/utils";
import { PopoverContentProps } from "@radix-ui/react-popover";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";

type Props = PopoverContentProps & {
  tags: string[];
  autoComplete: string[];
  className?: string;
  isLoading?: boolean;
  value?: string;
  onTagTextChange: (value: string) => void;
  onTagRemove: (index: number) => void;
  onTagSelect: (value: string) => void;
  onTagConfirm: (value: string) => void;
};

export default function TagsInput({
  className,
  autoComplete,
  tags,
  value,
  onTagTextChange,
  onTagRemove,
  onTagSelect,
  onTagConfirm,
  isLoading,
  ...restProps
}: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoComplete.length > 0) {
      setIsPopoverOpen(true);
    } else setIsPopoverOpen(false);
  }, [autoComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === " " && inputRef.current) value = inputRef.current.value = "";
    onTagTextChange(value);
  };

  const handleSelectItem = (value: string) => {
    if (tags.includes(value)) return;
    onTagSelect(value);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
      e.preventDefault();
      onTagRemove(tags.length - 1);
      return;
    }

    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (tags.includes(value)) return;
      if (value) onTagConfirm(value);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Focus first popover item on ArrowDown
    if (e.key === "ArrowDown" && isPopoverOpen && popoverRef.current) {
      e.preventDefault();
      const firstBtn = popoverRef.current.querySelector("button");
      if (firstBtn) {
        (firstBtn as HTMLButtonElement).focus();
      }
    }
  };

  return (
    <>
      <div className="relative mb-2 flex flex-wrap items-center gap-2 rounded-md border p-2">
        <Popover
          open={isPopoverOpen}
          onOpenChange={(state) => {
            if (autoComplete.length > 0 && state) {
              setIsPopoverOpen(true);
            } else setIsPopoverOpen(false);
          }}
        >
          <PopoverTrigger asChild autoFocus={false}>
            <div>
              <div className="flex flex-wrap items-stretch gap-1">
                {tags.map((tag, index) => (
                  <Badge className="flex gap-3 py-1 pe-1 hover:bg-slate-900" key={tag}>
                    {tag}
                    <X className="cursor-pointer" role="button" size={14} onClick={() => onTagRemove(index)} />
                  </Badge>
                ))}
                <Input
                  className="h-auto w-40 border-none p-0 focus-visible:border-none focus-visible:ring-0"
                  placeholder="Add or create tag"
                  ref={inputRef}
                  value={value}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                {isLoading && <LoadingSpinner className="absolute end-4 top-1 w-auto" size={18} />}
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            align="center"
            className={cn("w-auto p-0", className)}
            ref={popoverRef}
            onEscapeKeyDown={() => setIsPopoverOpen(false)}
            onOpenAutoFocus={(e) => e.preventDefault()}
            {...restProps}
          >
            <ul className="p-2">
              {autoComplete.map((option) => {
                if (tags.includes(option)) return;
                return (
                  <li key={option}>
                    <Button
                      className="w-full justify-start bg-transparent text-slate-900 hover:bg-slate-100"
                      onClick={() => handleSelectItem(option)}
                    >
                      {option}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
