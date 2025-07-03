"use client";

import { useTranslation } from "@/common/context/Translation";
import axios from "@/web/services/api/api.config";
import { getGuestToken, refreshToken } from "@/common/services/auth.service";
import { useUserStore } from "@/web/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import { IUser } from "@/types";
import { useRouter } from "@bprogress/next";
import { getLastPageBeforSignUp } from "@/common/lib/last-page-before-signup";
import { CHECK_TOKEN_QUERY_KEY, REFRESH_TOKEN_QUERY_KEY } from "@/common/constants/query-keys";
import { setToken } from "@/app/actions";
import initClient from "@/common/services/client/initClient.service";
import { resetAxiosIterceptor } from "@/common/services/client/resetAxiosIterceptor";
import { useLocalPathname } from "@/common/components/utils/LocalizedNavigation";

type ContextData = {
  loginUser: (user: { user: IUser; token: string }) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<ContextData | undefined>(undefined);

function useUserActions() {
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { pathname } = useLocalPathname();
  const { t } = useTranslation();

  // Mutations
  const setTokenMutation = useMutation({
    mutationKey: ["set-token"],
    mutationFn: (token: string) => setToken(token),
    onSuccess: () => {
      if (user?.isRegistered) router.push(getLastPageBeforSignUp());
    }
  });

  const guestTokenMutation = useMutation({
    mutationFn: getGuestToken,
    onSuccess: (res) => loginUser(res.data)
  });

  // Cleanup logic
  const cleanup = useCallback(async () => {
    axios.interceptors.request.clear();
    setUser(null);
    await queryClient.invalidateQueries({
      predicate: (q) => !q.queryKey.includes(CHECK_TOKEN_QUERY_KEY) && !q.queryKey.includes(REFRESH_TOKEN_QUERY_KEY)
    });
    queryClient.removeQueries({
      predicate: (q) => !q.queryKey.includes(CHECK_TOKEN_QUERY_KEY) && !q.queryKey.includes(REFRESH_TOKEN_QUERY_KEY)
    });
  }, [queryClient, setUser]);

  // Login
  const loginUser = useCallback(
    async (data: { user: IUser; token: string }) => {
      if (user) await cleanup();
      resetAxiosIterceptor(data.token);
      setUser(data.user);
      getCartItems();
      setTokenMutation.mutateAsync(data.token);
    },
    [user, cleanup, setUser, getCartItems, setTokenMutation]
  );

  // Logout
  const logout = useCallback(async () => {
    await cleanup();
    await guestTokenMutation.mutateAsync();
    if (pathname.includes("admin")) router.push("/login");
  }, [cleanup, guestTokenMutation, pathname, router]);

  // Init user
  const initUser = useCallback(
    (user: IUser) => {
      setUser(user);
      getCartItems();
    },
    [setUser, getCartItems]
  );

  // On init fail
  const onInitFail = useCallback(() => {
    guestTokenMutation.mutate();
  }, [guestTokenMutation]);

  // Token refresh logic
  const successRefresh = useCallback(
    (token: string) => {
      resetAxiosIterceptor(token);
      setTokenMutation.mutate(token);
    },
    [setTokenMutation]
  );

  const failedRefresh = useCallback(() => {
    cleanup();
    if (user?.isRegistered) toast.error(t("auth.forcedLogout"));
    if (pathname.includes("admin")) router.push("/login");
    guestTokenMutation.mutate();
  }, [cleanup, user, t, pathname, router, guestTokenMutation]);

  // Handle init
  const handleInit = useCallback(async () => {
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
    initUser(user as IUser);
    return "undefined";
  }, [onInitFail, initUser]);

  // Queries
  useQuery({
    queryKey: [CHECK_TOKEN_QUERY_KEY],
    queryFn: handleInit,
    retry: false
  });

  useQuery({
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

  return { loginUser, logout };
}

export default function UserProvider({ children }: { children: ReactNode }) {
  const value = useUserActions();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserSetup = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserSetup must be used within a UserProvider");
  return context;
};
