import { getEnvOrThrow } from "./utils";

export const BASE_API_URL = getEnvOrThrow("BASE_API_URL");
export const BASE_BACK_URL = getEnvOrThrow("BASE_BACK_URL");
export const SESSION_SECRET = getEnvOrThrow("SESSION_SECRET");
export const SESSION_NAME = "__xl_session__";
export const DEFAULT_REDIRECT = "/my-space";
