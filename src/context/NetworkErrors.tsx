"use client";
import Button from "@/components/ui/Button";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "./Translation";
import { useQuery } from "@tanstack/react-query";

export default function NetworkErrors({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<"NoNetwork" | "ServerDown" | false>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const setOnlineState = (err: "NoNetwork" | "ServerDown" | false) => {
      setError(err);
    };

    axios.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (!navigator.onLine) return Promise.reject(error);
        if (error.response) {
          if (error.status === 500) toast.error(t("serverFail"));
        } else if (error.request) {
          setOnlineState("ServerDown");
        }

        return Promise.reject(error);
      }
    );

    window.addEventListener("offline", () => setOnlineState("NoNetwork"));
    window.addEventListener("online", () => setOnlineState(false));

    return () => {
      window.removeEventListener("offline", () => setOnlineState("NoNetwork"));
      window.removeEventListener("online", () => setOnlineState(false));
    };
  }, []);

  useQuery({
    queryKey: ["statuse"],
    queryFn: () =>
      axios.get("/api/status").then(() => {
        setError(false);
      }),
    enabled: !!error && error === "ServerDown",
    refetchInterval: 1000
  });

  const checkError = () => {
    if ((error === "NoNetwork" && navigator.onLine) || error === "ServerDown") {
      setError(false);
    }
  };

  if (error) {
    return (
      <div className="mt-28 flex flex-col items-center justify-center">
        <Image
          alt="Error"
          className="object-contain contrast-0 filter"
          height={400}
          src="/images/product-not-found.png"
          width={400}
        />
        <h1 className="text-4xl font-bold text-secondary">{t(error)}</h1>
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
