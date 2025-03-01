import React, { useRef, useState } from "react";
import Input from "../ui/Input";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import Checkbox from "../ui/Checkbox";
import { ICategory, IFullProduct, ITag, IVendor } from "@/types";
import Image from "next/image";
import { RiCloseLine } from "react-icons/ri";
import Button from "../ui/Button";
import { LocalLink } from "@/components/LocalizedNavigation";
import { BiLoaderCircle } from "react-icons/bi";
import { Variants, motion } from "framer-motion";
import { useOverlayStore } from "@/stores/overlayStore";

type SearchResponseItem = {
  item: IFullProduct | IVendor | ITag | ICategory;
  type: "product" | "category" | "vendor" | "tag";
};

const bgVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const popupVariants: Variants = {
  hidden: { translateY: 40 },
  visible: { translateY: 0, transition: { duration: 0.15 } },
  exit: { translateY: 40, transition: { duration: 0.2 } }
};

export default function SearchOverlay() {
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);
  const isSearchOpen = useOverlayStore((state) => state.isSearchOpen);
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState({
    categories: false,
    vendors: false,
    tags: false,
    products: false
  });
  const timeoutRef = useRef<number>();

  const handleChange = (value: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setSearchText(value);
    }, 500);
  };

  const searchQuery = useQuery({
    queryKey: ["find", searchText, options],
    queryFn: () =>
      axios.post<SearchResponseItem[]>("/api/common/find", {
        ...options,
        searchText
      }),
    enabled: searchText.length > 0 && isSearchOpen
  });
  const items = searchQuery.data?.data ?? [];

  const setupItemLocalLink = (item: SearchResponseItem) => {
    return `/${item.type === "product" ? `product/${item.item.seName}` : `profile/${item.type}/${item.item.seName}`}`;
  };

  return (
    <motion.div animate="visible" data-testid="search-overlay" exit="exit" initial="hidden">
      <motion.div
        className="fixed z-40 h-screen w-screen bg-white bg-opacity-90 backdrop-blur-3xl"
        variants={bgVariants}
      >
        <motion.div className="mx-auto mt-4 max-w-[1200px] px-4 md:mt-14 md:px-28" variants={popupVariants}>
          <div className="relative">
            <Input
              className="rounded-full border-none bg-white p-4 pe-12 drop-shadow-md"
              placeholder="Find: vendor, product, category, tag"
              type="text"
              onChange={(e) => handleChange(e.currentTarget.value)}
            />
            <Button className="absolute end-0 top-0 py-4 text-gray-400" onClick={() => setIsSearchOpen(false)}>
              <RiCloseLine size="30" />
            </Button>
          </div>
          <div className="flex flex-wrap text-xs">
            <Checkbox label="Vendors" onChange={(e) => setOptions({ ...options, vendors: e.target.checked })} />
            <Checkbox label="Categories" onChange={(e) => setOptions({ ...options, categories: e.target.checked })} />
            <Checkbox label="Products" onChange={(e) => setOptions({ ...options, products: e.target.checked })} />
            <Checkbox label="Tags" onChange={(e) => setOptions({ ...options, tags: e.target.checked })} />
          </div>
          <div>
            {searchQuery.isFetching ? (
              <div className="flex w-full flex-col items-center justify-center py-2">
                <BiLoaderCircle className="animate-spin fill-primary" role="status" size={35} />
              </div>
            ) : (
              items.map((item) => (
                <LocalLink
                  className="flex cursor-pointer gap-2 p-4"
                  href={setupItemLocalLink(item)}
                  key={item.item._id}
                >
                  {"pictures" in item.item ? (
                    <div>
                      <Image
                        alt={item.item.name}
                        className="rounded-md object-cover"
                        height={40}
                        src={item.item.pictures[0].imageUrl}
                        width={40}
                      />
                    </div>
                  ) : null}
                  {"imageUrl" in item.item ? (
                    <div>
                      <Image
                        alt={item.item.name}
                        className="rounded-md object-cover"
                        height={40}
                        src={item.item.imageUrl}
                        width={40}
                      />
                    </div>
                  ) : null}
                  <div>
                    <h3 className="font-semibold">{item.item.name}</h3>
                    <p className="text-sm text-gray-400">{item.type}</p>
                  </div>
                </LocalLink>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
