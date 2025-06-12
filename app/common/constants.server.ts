import { getEnvOrThrow } from "../env.server";

export const BASE_API_URL = getEnvOrThrow("BASE_API_URL");
export const SESSION_SECRET = getEnvOrThrow("SESSION_SECRET");
export const HOME_URL = getEnvOrThrow("HOME_URL");
export const PERMISSIONS = {
  schedule: getEnvOrThrow("SCHEDULE_PERMS"),
};
export const SESSION_NAME = "__xl_session__";
export const LOGIN_REDIRECT = "/my-page";
export const MC_API_KEY = getEnvOrThrow("MC_API_KEY");
export const MC_URL = getEnvOrThrow("MC_URL");
export const MC_AUD_ALL_ID = "2acd5719d6";
