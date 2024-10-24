import { getEnvOrThrow } from "../env";

export const BASE_API_URL = getEnvOrThrow("BASE_API_URL");
export const SESSION_SECRET = getEnvOrThrow("SESSION_SECRET");
export const HOME_URL = getEnvOrThrow("HOME_URL");
export const PERMISSIONS = {
  schedule: getEnvOrThrow("SCHEDULE_PERMS"),
};
export const SESSION_NAME = "__xl_session__";
export const LOGIN_REDIRECT = "/my-page";
