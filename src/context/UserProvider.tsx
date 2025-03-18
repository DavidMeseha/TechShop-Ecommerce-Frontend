import { setToken, setUserCookies } from "@/actions";
import { useTranslation } from "@/context/Translation";
import axios from "@/lib/axios";
import { checkTokenValidity, getGuestToken, refreshToken } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { User } from "@/types";
import { useRouter } from "@bprogress/next";
import { getLastPageBeforSignUp } from "@/lib/localestorageAPI";
import tempActions from "@/stores/tempActionsCache";
import { usePathname } from "next/navigation";

type ContextData = {
  loginUser: (user: { user: User; token: string }) => void;
  logout: () => void;
};

const UserContext = createContext<ContextData | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const resetAxiosIterceptor = useCallback((token: string) => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, []);

  const cleanup = () => {
    setUser(null);
    axios.interceptors.request.clear();
    tempActions.clear();
    queryClient.clear();
  };

  const loginUser = async (data: { user: User; token: string }) => {
    cleanup();
    resetAxiosIterceptor(data.token);
    setUser(data.user);
    getCartItems();
    setUserCookies(data.token, data.user.language).then(() =>
      setTimeout(() => pathname.includes("login") && router.push(getLastPageBeforSignUp()), 500)
    );
  };

  const logout = async () => {
    cleanup();
    guestTokenMutation.mutateAsync().then(() => setTimeout(() => router.refresh(), 500));
  };

  //check token validity
  const _check = useQuery({
    queryKey: ["check"],
    queryFn: () =>
      checkTokenValidity()
        .then((data) => {
          setUser(data);
          getCartItems();
          return null;
        })
        .catch(() => {
          if (user?.isRegistered) toast.error(t("auth.forcedLogout"));
          guestTokenMutation.mutate();
          return null;
        })
  });

  //new guest token
  const guestTokenMutation = useMutation({
    mutationFn: () => getGuestToken(),
    onSuccess: async (res) => loginUser(res.data)
  });

  //refresh Token(only active if user logged in)
  const _refresh = useQuery({
    queryKey: ["refresh"],
    queryFn: () =>
      refreshToken()
        .then((res) => {
          resetAxiosIterceptor(res.data.token);
          setToken(res.data.token);
          return null;
        })
        .catch(() => {
          logout();
          return null;
        }),

    enabled: !!user?.isRegistered,
    refetchInterval: 1_680_000
  });

  const value = useMemo(() => ({ loginUser, logout }), [loginUser, logout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserSetup = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUserSetup must be used within a UserProvider");
  return context;
};
