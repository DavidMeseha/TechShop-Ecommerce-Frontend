import { AppRoutes, LocalLink } from "@/components/util/LocalizedNavigation";
import React from "react";

type Props = {
  activities: {
    name: string;
    value: number;
    to: string | null;
  }[];
};

export function UserActivity({ activities }: Props) {
  return (
    <div className="flex items-center py-4 text-center">
      {activities.map((activity, index) => (
        <React.Fragment key={index + activity.name}>
          {activity.to ? (
            <LocalLink className="min-w-[120px] flex-grow" href={activity.to as AppRoutes}>
              <div className="font-bold">{activity.value}</div>
              <div className="ps-1.5 text-[15px] font-light text-gray-500">{activity.name}</div>
            </LocalLink>
          ) : (
            <div className="min-w-[120px] flex-grow">
              <div className="font-bold">{activity.value}</div>
              <div className="ps-1.5 text-[15px] font-light text-gray-500">{activity.name}</div>
            </div>
          )}
          {index !== activities.length - 1 && <div className="bg-lightGray h-6 w-0.5" key={index}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}
