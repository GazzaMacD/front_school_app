export function getEnvOrThrow(name: string) {
  const envVar = process.env[name];
  if (!envVar) {
    throw new Error(`Missing environment variable -> ${name}. Please set it.`);
  }
  return envVar;
}
