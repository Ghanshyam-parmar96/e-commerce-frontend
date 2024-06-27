/**
 * An array of routes that are accessible to the public
 * these routes do not need to Authentication
 * @type {string[]}
 */

export const publicRoutes = ["/"];

/**
 * An array of routes that are user for Authentication
 * these routes redirect logged in users to "/"
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/account-verification",
  "/auth/forgot-password",
  "/auth/generate-new-password",
];

/**
 * the default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/";
