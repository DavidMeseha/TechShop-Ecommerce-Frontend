import { setToken } from "@/actions";
import { useTranslation } from "@/context/Translation";
import axios from "@/lib/axios";
import { checkTokenValidity, getGuestToken, refreshToken } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { toast } from "react-toastify";

export default function UserSetup() {
  const { setUserActions, setUser } = useUserStore();
  const { user } = useUserStore();
  const { t } = useTranslation();

  const resetAxiosIterceptor = useCallback((token: string) => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, []);

  //check token validity
  const _check = useQuery({
    queryKey: ["checkToken"],
    queryFn: () =>
      checkTokenValidity()
        .then((data) => {
          setUser(data);
          setUserActions();
        })
        .catch(() => {
          if (user?.isRegistered) toast.error(t("auth.forcedLogout"));
          guestTokenMutation.mutate();
        })
  });

  //new guest token
  const guestTokenMutation = useMutation({
    mutationFn: () => getGuestToken(),
    onSuccess: async (res) => {
      setUser(res.data.user);
      await setToken(res.data.token);
      resetAxiosIterceptor(res.data.token);
      setUserActions();
    }
  });

  //refresh Token(only active if user logged in)
  const _refresh = useQuery({
    queryKey: ["refresh"],
    queryFn: () =>
      refreshToken()
        .then((res) => {
          setToken(res.data.token);
          resetAxiosIterceptor(res.data.token);
          return null;
        })
        .catch(() => {
          guestTokenMutation.mutate();
          return null;
        }),

    enabled: !!user?.isRegistered,
    refetchInterval: 1_680_000
  });

  return <></>;
}
