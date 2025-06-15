import { LocalLink } from "@/components/util/LocalizedNavigation";
import { ITag } from "@/types";
import { BsHash } from "react-icons/bs";

type Props = {
  tag: ITag;
};

export default function TagItem({ tag }: Props) {
  return (
    <li className="mx-2 my-2 inline-flex items-center rounded-full border px-4 py-2">
      <BsHash size={35} />
      <LocalLink className="text-sm font-bold" href={`/tag/${tag.seName}`}>
        <p>{tag.name}</p>
        <p className="w-max text-xs text-gray-400">{tag.productCount} products</p>
      </LocalLink>
    </li>
  );
}
