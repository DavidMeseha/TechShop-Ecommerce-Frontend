<<<<<<< HEAD
import { setToken, setUserCookies } from "@/actions";
=======
>>>>>>> addde30f08de3b0adab31f2274ed12eef59d03c8
import { useTranslation } from "@/context/Translation";
import { resetAxiosIterceptor } from "@/lib/axios";
import { checkTokenValidity, getGuestToken, refreshToken } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "react-toastify";
<<<<<<< HEAD
import { User } from "@/types";
import { useRouter } from "@bprogress/next";
import { getLastPageBeforSignUp } from "@/lib/localestorageAPI";
import tempActions from "@/stores/tempActionsCache";

type ContextData = {
  setupUser: (user: { user: User; token: string }) => void;
  logout: () => void;
};

const UserContext = createContext<ContextData | undefined>(undefined);
=======
import { Language } from "@/types";
import { setToken, setupUserCookies } from "@/actions";
import useUser from "@/hooks/useUser";
>>>>>>> addde30f08de3b0adab31f2274ed12eef59d03c8

export default function UserProvider({ children }: { children: ReactNode }) {
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();
<<<<<<< HEAD

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

  const setupUser = async (data: { user: User; token: string }) => {
    cleanup();
    resetAxiosIterceptor(data.token);
    setUser(data.user);
    setUserCookies(data.token, data.user.language).then(() => router.push(getLastPageBeforSignUp()));
  };

  const logout = async () => {
    cleanup();
    guestTokenMutation.mutateAsync().then(() => router.push("/login"));
  };
=======
  const { logout } = useUser();
>>>>>>> addde30f08de3b0adab31f2274ed12eef59d03c8

  //check token validity
  const _userSetup = useQuery({
    queryKey: ["user"],
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
    mutationKey: ["guestToken"],
    mutationFn: () => getGuestToken(),
    onSuccess: async (res) => {
      resetAxiosIterceptor(res.data.token);
      setUser(res.data.user);
      getCartItems();
      setupUserCookies(res.data.token, res.data.user.language as Language);
    }
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

  return children;
}
