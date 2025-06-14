import Skeleton from "react-loading-skeleton";
import LoadingTheme from "./LoadingSkeletonTheme";

export default function TagItemLoading() {
  return (
    <LoadingTheme>
      <Skeleton borderRadius={999} className="h-14 min-w-32" />
    </LoadingTheme>
  );
}
