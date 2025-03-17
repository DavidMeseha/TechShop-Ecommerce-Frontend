import { useTranslation } from "@/context/Translation";
import { resetAxiosIterceptor } from "@/lib/axios";
import { checkTokenValidity, getGuestToken, refreshToken } from "@/services/auth.service";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "react-toastify";
import { Language } from "@/types";
import { setToken, setupUserCookies } from "@/actions";
import useUser from "@/hooks/useUser";

export default function UserProvider({ children }: { children: ReactNode }) {
  const getCartItems = useUserStore((state) => state.getCartItems);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();
  const { logout } = useUser();

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
