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
    dateString = `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()}`;
  } else {
    dateString = `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()} ~ ${endDate.getFullYear()}.${endDate.getMonth()}.${endDate.getDate()}`;
  }
  return dateString;
}

export function getDateStringWithDays(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = ["Sun", "Mon", "Tue", "Thu", "Fri", "Sat"];
  let dateString: string;
  if (startDate.getTime() === endDate.getTime()) {
    dateString = `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()} (${
      days[startDate.getDay()]
    })`;
  } else {
    dateString = `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()} (${
      days[startDate.getDay()]
    }) ~ ${endDate.getFullYear()}.${endDate.getMonth()}.${endDate.getDate()} (${
      days[endDate.getDay()]
    })`;
  }
  return dateString;
}

/*
 * Display functions
 */
export function getDisplay(str: string, langNum: number) {
  return str.split(",")[langNum];
}

/*
 * Hash creators
 *
 * For creating hash map objects to map numbers
 * to letters primarily for grid css layouts
 */
export function getDivisor4LetterHash(length: number) {
  const hash: Record<string, string> = {};
  const letters = "abcd";
  let count = 0;
  for (let i = 0; i < length; i++) {
    hash[i] = letters[count];
    count += 1;
    if (count > 3) count = 0;
  }
  return hash;
}

export function getDivisor3LetterHash(length: number) {
  const hash: Record<string, string> = {};
  const letters = "abc";
  let count = 0;
  for (let i = 0; i < length; i++) {
    hash[i] = letters[count];
    count += 1;
    if (count > 2) count = 0;
  }
  return hash;
}
