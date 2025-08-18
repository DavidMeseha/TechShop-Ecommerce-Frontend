"use client";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import axios from "@/common/services/api/api.config";
import { isAxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "@/common/context/Translation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@bprogress/next";
import { APP_STATUS_QUERY_KEY } from "@/common/constants/query-keys";

export default function NetworkErrors({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<"NoNetwork" | "ServerDown" | "ServerOff" | false>(false);
  const router = useRouter();
  const { t } = useTranslation();

  const setOnlineState = useCallback((err: "NoNetwork" | "ServerDown" | "ServerOff" | false) => {
    setError(err);
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (navigator.onLine) {
          if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) router.push("/login");
            if (error.response.status === 500) toast.error(t("serverFail"));
          } else {
            setOnlineState("ServerOff");
          }
        }

        return Promise.reject(error);
      }
    );

    const handleOffline = () => setOnlineState("NoNetwork");
    const handleOnline = () => setOnlineState(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      axios.interceptors.response.eject(interceptor);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [setOnlineState, t]);

  // Status check query
  const statusQuery = useQuery({
    queryKey: [APP_STATUS_QUERY_KEY],
    queryFn: async () =>
      axios
        .get("/api/status")
        .then(() => {
          queryClient.invalidateQueries({ predicate: (q) => !q.queryKey.includes(APP_STATUS_QUERY_KEY) });
          setError(false);
          return true;
        })
        .catch(() => {
          return false;
        }),
    enabled: error === "ServerDown" || error === "ServerOff",
    refetchInterval: (data) => (data ? false : 1000),
    retry: 3
  });

  const check = () => {
    if ((error === "NoNetwork" && navigator.onLine) || error === "ServerOff") statusQuery.refetch();
  };

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        {/* <Image
          alt="Error"
          className="object-contain contrast-0 filter"
          height={400}
          priority
          src="/images/product-not-found.png"
          width={400}
        /> */}
        <h1 className="text-4xl font-bold text-primary">{error === "NoNetwork" ? "No Network" : "500"}</h1>
        <p className="mt-4 text-gray-400">{t(error)}</p>
        <SubmitButton
          className="mt-12 bg-primary text-white hover:underline"
          isLoading={statusQuery.isFetching}
          onClick={check}
        >
          <div className="flex items-center gap-2">
            Retry <FaRedo size={13} />
          </div>
        </SubmitButton>
      </div>
    );
  }

  return children;
}
