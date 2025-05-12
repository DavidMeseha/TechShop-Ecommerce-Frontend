export function setToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict; secure`;
}

export function removeToken() {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure";
}

export function getToken(): string | null {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}
