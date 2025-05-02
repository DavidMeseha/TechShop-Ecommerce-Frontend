import { setToken, setUserCookies } from "@/actions";
import { useTranslation } from "@/context/Translation";
import axios, { resetAxiosIterceptor } from "@/lib/axios";
import { checkTokenValidity, getGuestToken, refreshToken } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";
import { toast } from "react-toastify";
import { User } from "@/types";
import { useRouter } from "@bprogress/next";
import { getLastPageBeforSignUp } from "@/lib/localestorageAPI";
import { usePathname } from "next/navigation";
import { CHECK_USER_TOKEN_QUERY_KEY, REFRESH_TOKEN_QUERY_KEY } from "@/constants/query-keys";

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

  const cleanup = async () => {
    axios.interceptors.request.clear();
    setUser(null);
    await queryClient.invalidateQueries({
      predicate: (q) =>
        !q.queryKey.includes(CHECK_USER_TOKEN_QUERY_KEY) && !q.queryKey.includes(REFRESH_TOKEN_QUERY_KEY)
    });
  };

  const loginUser = async (data: { user: User; token: string }) => {
    if (user) await cleanup();
    resetAxiosIterceptor(data.token);
    setUser(data.user);
    getCartItems();
    setUserCookies(data.token, data.user.language).then(
      () => pathname.includes("login") && setTimeout(() => router.push(getLastPageBeforSignUp()), 500)
    );
  };

  const logout = async () => {
    cleanup();
    guestTokenMutation.mutateAsync().then(() => setTimeout(() => router.push("/login"), 500));
  };

  const initUser = (user: User) => {
    setUser(user);
    getCartItems();
    return null;
  };

  const onInitFail = () => {
    guestTokenMutation.mutate();
    return null;
  };

  const successRefresh = (token: string) => {
    resetAxiosIterceptor(token);
    setToken(token);
    return null;
  };

  const failedRefresh = () => {
    cleanup();
    if (user?.isRegistered) toast.error(t("auth.forcedLogout"));
    guestTokenMutation.mutateAsync();
    return null;
  };

  //check token validity
  const _check = useQuery({
    queryKey: [CHECK_USER_TOKEN_QUERY_KEY],
    queryFn: () =>
      checkTokenValidity()
        .then((data) => initUser(data))
        .catch(() => onInitFail())
  });

  //new guest token
  const guestTokenMutation = useMutation({
    mutationFn: () => getGuestToken(),
    onSuccess: (res) => loginUser(res.data)
  });

  //refresh Token(only active if user logged in)
  const _refresh = useQuery({
    queryKey: [REFRESH_TOKEN_QUERY_KEY],
    queryFn: () =>
      refreshToken()
        .then((res) => successRefresh(res.data.token))
        .catch(() => failedRefresh()),

    enabled: !!user?.isRegistered,
    refetchInterval: 1_680_000
  });

  const value = { loginUser, logout };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserSetup = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUserSetup must be used within a UserProvider");
  return context;
};
