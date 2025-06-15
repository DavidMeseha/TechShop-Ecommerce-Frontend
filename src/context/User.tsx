"use client";

import { useTranslation } from "@/context/Translation";
import axios, { resetAxiosIterceptor } from "@/services/api/axios.config";
import { getGuestToken, refreshToken } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";
import { toast } from "react-toastify";
import { IUser } from "@/types";
import { useRouter } from "@bprogress/next";
import { getLastPageBeforSignUp } from "@/lib/last-page-before-signup";
import { CHECK_TOKEN_QUERY_KEY, REFRESH_TOKEN_QUERY_KEY } from "@/constants/query-keys";
import { setToken } from "@/actions";
import initClient from "@/services/client/initClient.service";

type ContextData = {
  loginUser: (user: { user: IUser; token: string }) => void;
  logout: () => void;
};

const UserContext = createContext<ContextData | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  const cleanup = async () => {
    axios.interceptors.request.clear();
    setUser(null);
    await queryClient.invalidateQueries({
      predicate: (q) => !q.queryKey.includes(CHECK_TOKEN_QUERY_KEY) && !q.queryKey.includes(REFRESH_TOKEN_QUERY_KEY)
    });
    queryClient.removeQueries({
      predicate: (q) => !q.queryKey.includes(CHECK_TOKEN_QUERY_KEY) && !q.queryKey.includes(REFRESH_TOKEN_QUERY_KEY)
    });
  };

  const loginUser = async (data: { user: IUser; token: string }) => {
    if (user) await cleanup();
    resetAxiosIterceptor(data.token);
    setUser(data.user);
    getCartItems();
    setTokenMutation.mutate(data.token);
  };

  const logout = async () => {
    cleanup();
    await guestTokenMutation.mutateAsync();
    // router.push("/login");
  };

  const initUser = (user: IUser) => {
    setUser(user);
    getCartItems();
  };

  const onInitFail = () => {
    guestTokenMutation.mutate();
  };

  const successRefresh = (token: string) => {
    resetAxiosIterceptor(token);
    setTokenMutation.mutate(token);
  };

  const failedRefresh = () => {
    cleanup();
    if (user?.isRegistered) toast.error(t("auth.forcedLogout"));
    guestTokenMutation.mutate();
  };

  const handleInit = async () => {
    const data = await initClient();

    if (!data) {
      onInitFail();
      return null;
    }

    const { token, ...user } = data;

    if (!token || !user) {
      onInitFail();
      return null;
    }

    resetAxiosIterceptor(token);
    initUser(user);

    return "undefined";
  };

  //init user
  useQuery({
    queryKey: [CHECK_TOKEN_QUERY_KEY],
    queryFn: handleInit,
    retry: false
  });

  //new guest token
  const guestTokenMutation = useMutation({
    mutationFn: getGuestToken,
    onSuccess: (res) => loginUser(res.data)
  });

  //refresh Token(only active if user logged in)
  const _refresh = useQuery({
    queryKey: [REFRESH_TOKEN_QUERY_KEY],
    queryFn: async () => {
      try {
        const refresh = await refreshToken();
        successRefresh(refresh.data.token);
      } catch {
        failedRefresh();
      }
      return "null";
    },

    enabled: !!user?.isRegistered,
    refetchInterval: 1_680_000
  });

  const setTokenMutation = useMutation({
    mutationKey: ["set-token"],
    mutationFn: (token: string) => setToken(token),
    onSuccess: () => {
      if (user?.isRegistered) router.push(getLastPageBeforSignUp());
    }
  });

  const value = { loginUser, logout };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserSetup = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUserSetup must be used within a UserProvider");
  return context;
};
