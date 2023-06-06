import { BASE_API_URL } from "~/common/constants";

/*
 * Env Utils
 */
export function getEnvOrThrow(name: string) {
  const envVar = process.env[name];
  if (!envVar) {
    throw new Error(`Missing environment variable -> ${name}. Please set it.`);
  }
  return envVar;
}
/*
 * Preview Utils
 */
export async function handlePreview<T>(
  request: Request
): Promise<{ isPreview: boolean; data: T | null; error: string | null }> {
  const params = new URL(request.url).searchParams;
  const draft = params.get("draft");
  const id = params.get("id");
  if (draft && id) {
    try {
      const response = await fetch(`${BASE_API_URL}/pages/${id}/?draft=true`);
      if (!response.ok) {
        throw new Error(`Error Status: ${response.status}`);
      }
      const data = await response.json();
      return {
        isPreview: true,
        data,
        error: null,
      };
    } catch (error) {
      return {
        isPreview: false,
        data: null,
        error: JSON.stringify(error),
      };
    }
  } //end draft
  return {
    isPreview: false,
    data: null,
    error: null,
  };
}
