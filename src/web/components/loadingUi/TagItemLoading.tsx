import Skeleton from "react-loading-skeleton";
import LoadingTheme from "../../../common/components/loadingUi/LoadingSkeletonTheme";

export default function TagItemLoading() {
  return (
    <LoadingTheme>
      <Skeleton borderRadius={999} className="h-14 min-w-32" />
    </LoadingTheme>
  );
}
