"use client";
import Button from "@/components/ui/Button";
import axios from "@/services/api/axios.config";
import { isAxiosError } from "axios";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@bprogress/next";
import { APP_STATUS_QUERY_KEY } from "@/constants/query-keys";

export default function NetworkErrors({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<"NoNetwork" | "ServerDown" | false>(false);
  const router = useRouter();
  const { t } = useTranslation();

  const setOnlineState = useCallback((err: "NoNetwork" | "ServerDown" | false) => {
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
            setOnlineState("ServerDown");
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
  const _status = useQuery({
    queryKey: [APP_STATUS_QUERY_KEY],
    queryFn: async () =>
      axios
        .get("/api/status")
        .then(() => {
          setError(false);
          return true;
        })
        .catch(() => {
          return false;
        }),
    enabled: error === "ServerDown",
    refetchInterval: (data) => (data ? false : 1000),
    retry: 3
  });

  const check = () => {
    if ((error === "NoNetwork" && navigator.onLine) || error === "ServerDown") setError(false);
  };

  if (error) {
    return (
      <div className="mt-28 flex flex-col items-center justify-center">
        <Image
          alt="Error"
          className="object-contain contrast-0 filter"
          height={400}
          priority
          src="/images/product-not-found.png"
          width={400}
        />
        <h1 className="text-4xl font-bold text-gray-400">{t(error)}</h1>
        <Button className="mt-4 bg-primary text-white hover:underline" onClick={check}>
          <div className="flex items-center gap-2">
            Retry <FaRedo size={13} />
          </div>
        </Button>
      </div>
    );
  }

  return children;
}
