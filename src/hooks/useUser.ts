import { Language, User } from "@/types";
import { setupUserCookies } from "@/actions";
import { resetAxiosIterceptor } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import tempActions from "@/stores/tempActionsCache";
import { useRouter } from "@bprogress/next";
import { useUserStore } from "@/stores/userStore";
import { getLastPageBeforSignUp } from "@/lib/localestorageAPI";
import { usePathname } from "next/navigation";

export default function useUser() {
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const login = (user: User, token: string) => {
    resetAxiosIterceptor(token);
    tempActions.clear();
    queryClient.invalidateQueries();
    setupUserCookies(token, user.language as Language).then(() => router.push(getLastPageBeforSignUp()));
  };

  const logout = async () => {
    setUser(null);
    resetAxiosIterceptor("");
    tempActions.clear();
    queryClient.invalidateQueries();
    // queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    !pathname.includes("/login") && router.push("/login");
  };

  return { login, logout };
}
