import { createGlobalEnvObj, type TGlobalEnv } from "~/env.server";
/*
 * Get Environment variables on client or server
 */
export function getGlobalEnv(): TGlobalEnv {
  if (typeof window !== "undefined") {
    // on client side
    return window.GLOBAL_ENV;
  } else {
    // on server side
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

/*
 * Date and time functions
 */

export function getDateString(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let dateString: string;
  if (startDate.getTime() === endDate.getTime()) {
    dateString = `${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDay()}`;
  } else {
    dateString = `${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDay()} ~ ${endDate.getFullYear()}/${endDate.getMonth()}/${endDate.getDay()}`;
  }
  return dateString;
}
