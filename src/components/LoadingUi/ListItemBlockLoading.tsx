import Skeleton from "react-loading-skeleton";
import LoadingTheme from "./LoadingSkeletonTheme";

interface Props {
  height: number;
}

export default function ListItemBlockLoading({ height = 80 }: Props) {
  return (
    <LoadingTheme>
      <Skeleton className="w-full" height={height} />
    </LoadingTheme>
  );
}
