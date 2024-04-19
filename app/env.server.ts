/*
 * Env Functions
 */
export function getEnvOrThrow(name: string) {
  const envVar = process.env[name];
  if (!envVar) {
    throw new Error(`Missing environment variable -> ${name}. Please set it.`);
  }
  return envVar;
}

export function createGlobalEnvObj() {
  return {
    BASE_BACK_URL: getEnvOrThrow("BASE_BACK_URL"),
    HOME_URL: getEnvOrThrow("HOME_URL"),
  };
}

export type TGlobalEnv = ReturnType<typeof createGlobalEnvObj>;
