import { getEnvOrThrow } from "./utils";

export const BASE_API_URL = getEnvOrThrow("BASE_API_URL");
export const SESSION_SECRET = getEnvOrThrow("SESSION_SECRET");
export const SESSION_NAME = "__xl_session__";
