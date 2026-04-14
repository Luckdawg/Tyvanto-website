export const COOKIE_NAME = "app_session_id";

/**
 * Email addresses that are automatically promoted to the 'admin' role on first login.
 * Add or remove addresses here to manage auto-promoted admins.
 */
export const ADMIN_EMAILS: ReadonlySet<string> = new Set([
  "mlucky@visiumtechnologies.com",
  "edevane@visiumtechnologies.com",
  "inoble.ctr@visiumtechnologies.com",
]);
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
