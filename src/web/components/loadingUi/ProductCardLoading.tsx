import Skeleton from "react-loading-skeleton";
import LoadingTheme from "../../../common/components/loadingUi/LoadingSkeletonTheme";

export default function ProductCardLoading() {
  return (
    <LoadingTheme>
      <div className="flex w-full flex-col justify-between overflow-hidden rounded-sm border bg-white">
        <div>
          <div className="p-2">
            <Skeleton height={176} />
          </div>
          <div className="mt-2 flex flex-col gap-1 px-2">
            <Skeleton />
            <Skeleton width={120} />
            <Skeleton width={50} />
            <Skeleton height={20} width={100} />
          </div>
        </div>

        <div className="mt-4 flex border-t border-gray-200">
          <div className="basis-1/3 rounded-none border-e fill-black p-1">
            <Skeleton />
          </div>
          <div className="basis-1/3 rounded-none border-e fill-black p-1">
            <Skeleton />
          </div>
          <div className="basis-1/3 rounded-none border-e fill-black p-1">
            <Skeleton />
          </div>
        </div>
      </div>
    </LoadingTheme>
  );
}
