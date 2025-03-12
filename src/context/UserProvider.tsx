import { setLanguage, setToken } from "@/actions";
import { useTranslation } from "@/context/Translation";
import axios from "@/lib/axios";
import { checkTokenValidity, getGuestToken, refreshToken } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { User } from "@/types";
import { useRouter } from "@bprogress/next";

type ContextData = {
  setupUser: (user: { user: User; token: string }) => void;
  logout: () => void;
};

const UserContext = createContext<ContextData | undefined>(undefined);

export default function UserProvider({ children }: { token?: string; children: ReactNode }) {
  const setUserActions = useUserStore((state) => state.setUserActions);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  const resetAxiosIterceptor = useCallback((token: string) => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    queryClient.invalidateQueries({ queryKey: ["checkToken"] });
    queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
  }, []);

  const setupUser = async (data: { user: User; token: string }) => {
    setUser(data.user);
    await setToken(data.token);
    await setLanguage(data.user.language);
    resetAxiosIterceptor(data.token);
    queryClient.clear();
  };

  const logout = async () => {
    setUser(null);
    setLanguage("en");
    await guestTokenMutation.mutateAsync();
    router.push("/login");
    queryClient.clear();
  };

  //check token validity
  const _check = useQuery({
    queryKey: ["checkToken"],
    queryFn: () =>
      checkTokenValidity()
        .then((data) => {
          setUser(data);
          setUserActions();
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
    mutationFn: () =>
      getGuestToken().then(async (res) => {
        await setToken(res.data.token);
        return res;
      }),
    onSuccess: async (res) => {
      setUser(res.data.user);
      setUserActions();
      resetAxiosIterceptor(res.data.token);
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

  const value = useMemo(() => ({ setupUser, logout }), [setupUser, logout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserSetup = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUserSetup must be used within a UserProvider");
  return context;
};
