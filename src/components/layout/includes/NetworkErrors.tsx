"use client";
import Button from "@/components/ui/Button";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { FaRedo } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "@/context/Translation";
import { useQuery } from "@tanstack/react-query";
import { useOverlayStore } from "@/stores/overlayStore";

export default function NetworkErrors({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<"NoNetwork" | "ServerDown" | false>(false);
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);
  const { t } = useTranslation();

  const setOnlineState = useCallback((err: "NoNetwork" | "ServerDown" | false) => {
    setError(err);
  }, []);

  useEffect(() => {
    // Create interceptor
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (!navigator.onLine) return Promise.reject(error);
        if (error.response) {
          if (error.response.status === 401) setIsLoginOpen(true);
          if (error.response.status === 500) toast.error(t("serverFail"));
        } else if (error.request) {
          setOnlineState("ServerDown");
          return Promise.reject(error);
        }
      }
    );

    const handleOffline = () => setOnlineState("NoNetwork");
    const handleOnline = () => setOnlineState(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Cleanup function
    return () => {
      axios.interceptors.response.eject(interceptor);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [setOnlineState, t]);

  // Status check query
  useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      try {
        await axios.get("/api/status");
        setError(false);
        return true;
      } catch {
        return false;
      }
    },
    enabled: error === "ServerDown",
    refetchInterval: (data) => (data ? false : 1000),
    retry: 3
  });

  const checkError = useCallback(() => {
    if ((error === "NoNetwork" && navigator.onLine) || error === "ServerDown") {
      setError(false);
    }
  }, [error]);

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
        <Button className="mt-4 bg-primary text-white hover:underline" onClick={checkError}>
          <div className="flex items-center gap-2">
            Retry <FaRedo size={13} />
          </div>
        </Button>
      </div>
    );
  }

  return children;
}
