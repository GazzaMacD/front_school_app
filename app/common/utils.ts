import { createGlobalEnvObj, type TGlobalEnv } from "~/env.server";
/*
 * Get Environment variables on client or server
 */
export function getGlobalEnv(): TGlobalEnv {
  if (typeof window !== "undefined") {
    return window.GLOBAL_ENV;
  } else {
    return createGlobalEnvObj();
  }
}

/*
 * Meta functions
 */
export function getTitle({
  title,
  isHome,
}: {
  title: string;
  isHome: boolean;
}): string {
  const baseTitle = "英会話・語学学校 エクスリンガル";
  return isHome ? baseTitle : `${title} | ${baseTitle}`;
}
