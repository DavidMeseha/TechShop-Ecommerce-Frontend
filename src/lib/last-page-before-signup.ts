/**
 * Retrieves the last visited page URL before user signup/login
 * @returns {string} The stored URL or "/" if no URL was stored
 */
export function getLastPageBeforSignUp() {
  return localStorage.getItem("lastRouteBeforeLogin") ?? "/";
}

/**
 * Stores the current page URL before redirecting to signup/login
 * @param {string} url - The URL to store
 * @throws {Error} If localStorage is not available or quota is exceeded
 */
export function setLastPageBeforSignUp(url: string) {
  localStorage.setItem("lastRouteBeforeLogin", url);
}
