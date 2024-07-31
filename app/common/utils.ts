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
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// Redirects

type TRedirects = {
  [key: string]: {
    path: string;
    statusCode: number;
  };
};

export const redirects: TRedirects = {
  "blog/": {
    path: "/blog-lessons",
    statusCode: 301,
  },
  "blog/english/5-popular-christmas-songs-undiscovered-in-japan": {
    path: "https://archive.xlingual.co.jp/blog/english/5-popular-christmas-songs-undiscovered-in-japan/",
    statusCode: 302,
  },
  "blog/english/a-slow-discovery/": {
    path: "https://archive.xlingual.co.jp/blog/english/a-slow-discovery/",
    statusCode: 302,
  },
  "blog/english/animalistic-adjectives/": {
    path: "https://archive.xlingual.co.jp/blog/english/animalistic-adjectives/",
    statusCode: 302,
  },
  "blog/english/apologizing-part-i-sorry-and-excuse-me/": {
    path: "https://archive.xlingual.co.jp/blog/english/apologizing-part-i-sorry-and-excuse-me/",
    statusCode: 302,
  },
  "blog/english/are-you-exciting/": {
    path: "https://archive.xlingual.co.jp/blog/english/are-you-exciting/",
    statusCode: 302,
  },
  "blog/english/are-you-using-as-as-correctly/": {
    path: "https://archive.xlingual.co.jp/blog/english/are-you-using-as-as-correctly/",
    statusCode: 302,
  },
  "blog/english/become-proficient-in-english-in-30-days/": {
    path: "https://archive.xlingual.co.jp/blog/english/become-proficient-in-english-in-30-days/",
    statusCode: 302,
  },
  "blog/english/easy-english-blog-snowbirds/": {
    path: "https://archive.xlingual.co.jp/blog/english/easy-english-blog-snowbirds/",
    statusCode: 302,
  },
  "blog/english/eg-ie-etc-what-do-they-mean/": {
    path: "https://archive.xlingual.co.jp/blog/english/eg-ie-etc-what-do-they-mean/",
    statusCode: 302,
  },
  "blog/english/eiken-adjective-crossword/": {
    path: "https://archive.xlingual.co.jp/blog/english/eiken-adjective-crossword/",
    statusCode: 302,
  },
  "blog/english/english-is-a-sport/": {
    path: "https://archive.xlingual.co.jp/blog/english/english-is-a-sport/",
    statusCode: 302,
  },
  "blog/english/enjoying-perfumes-in-english/": {
    path: "https://archive.xlingual.co.jp/blog/english/enjoying-perfumes-in-english/",
    statusCode: 302,
  },
  "blog/english/former-ex-and-late/": {
    path: "https://archive.xlingual.co.jp/blog/english/former-ex-and-late/",
    statusCode: 302,
  },
  "blog/english/heard-in-the-classroom-juicy-sensory-verbs/": {
    path: "https://archive.xlingual.co.jp/blog/english/heard-in-the-classroom-juicy-sensory-verbs/",
    statusCode: 302,
  },
  "blog/english/heard-in-the-classroom-thunder-vs-lightning/": {
    path: "https://archive.xlingual.co.jp/blog/english/heard-in-the-classroom-thunder-vs-lightning/",
    statusCode: 302,
  },
  "blog/english/how-can-i-improve-my-english-reading/": {
    path: "https://archive.xlingual.co.jp/blog/english/how-can-i-improve-my-english-reading/",
    statusCode: 302,
  },
  "blog/english/how-many-families-do-you-have/": {
    path: "https://archive.xlingual.co.jp/blog/english/how-many-families-do-you-have/",
    statusCode: 302,
  },
  "blog/english/how-not-to-offend-when-talking-about-the-dead/": {
    path: "https://archive.xlingual.co.jp/blog/english/how-not-to-offend-when-talking-about-the-dead/",
    statusCode: 302,
  },
  "blog/english/i-made-an-appointment-with-my-friend-1-thats-not-the-correct-word/":
    {
      path: "https://archive.xlingual.co.jp/blog/english/i-made-an-appointment-with-my-friend-1-thats-not-the-correct-word/",
      statusCode: 302,
    },
  "blog/english/i-made-an-appointment-with-my-friend-2-mastering-to-make-plans/":
    {
      path: "https://archive.xlingual.co.jp/blog/english/i-made-an-appointment-with-my-friend-2-mastering-to-make-plans/",
      statusCode: 302,
    },
  "blog/english/i-think-i-can/": {
    path: "https://archive.xlingual.co.jp/blog/english/i-think-i-can/",
    statusCode: 302,
  },
  "blog/english/ikea-hacks-in-nagakute/": {
    path: "https://archive.xlingual.co.jp/blog/english/ikea-hacks-in-nagakute/",
    statusCode: 302,
  },
  "blog/english/immerse-yourself-in-language/": {
    path: "https://archive.xlingual.co.jp/blog/english/immerse-yourself-in-language/",
    statusCode: 302,
  },
  "blog/english/in-vs-on-vehicles/": {
    path: "https://archive.xlingual.co.jp/blog/english/in-vs-on-vehicles/",
    statusCode: 302,
  },
  "blog/english/is-persons-and-peoples-wrong/": {
    path: "https://archive.xlingual.co.jp/blog/english/is-persons-and-peoples-wrong/",
    statusCode: 302,
  },
  "blog/english/language-learning-plateaus-what-are-they/": {
    path: "https://archive.xlingual.co.jp/blog/english/language-learning-plateaus-what-are-they/",
    statusCode: 302,
  },
  "blog/english/make-a-wish-or-is-it-a-hope-a-desire/": {
    path: "https://archive.xlingual.co.jp/blog/english/make-a-wish-or-is-it-a-hope-a-desire/",
    statusCode: 302,
  },
  "blog/english/midnight-mistakes/": {
    path: "https://archive.xlingual.co.jp/blog/english/midnight-mistakes/",
    statusCode: 302,
  },
  "blog/english/more-than-just-thank-you-and-youre-welcome/": {
    path: "https://archive.xlingual.co.jp/blog/english/more-than-just-thank-you-and-youre-welcome/",
    statusCode: 302,
  },
  "blog/english/must-not-vs-do-not-have-to/": {
    path: "https://archive.xlingual.co.jp/blog/english/must-not-vs-do-not-have-to/",
    statusCode: 302,
  },
  "blog/english/my-japanese-language-adventure/": {
    path: "https://archive.xlingual.co.jp/blog/english/my-japanese-language-adventure/",
    statusCode: 302,
  },
  "blog/english/my-parents-grew-me-with-strict-rules/": {
    path: "https://archive.xlingual.co.jp/blog/english/my-parents-grew-me-with-strict-rules/",
    statusCode: 302,
  },
  "blog/english/notice-vs-realize/": {
    path: "https://archive.xlingual.co.jp/blog/english/notice-vs-realize/",
    statusCode: 302,
  },
  "blog/english/please-a-powerful-word/": {
    path: "https://archive.xlingual.co.jp/blog/english/please-a-powerful-word/",
    statusCode: 302,
  },
  "blog/english/present-simple-tense-for-future/": {
    path: "https://archive.xlingual.co.jp/blog/english/present-simple-tense-for-future/",
    statusCode: 302,
  },
  "blog/english/quick-tip-date-of-birth-vs-birthday/": {
    path: "https://archive.xlingual.co.jp/blog/english/quick-tip-date-of-birth-vs-birthday/",
    statusCode: 302,
  },
  "blog/english/quick-tip-hang-out-vs-play/": {
    path: "https://archive.xlingual.co.jp/blog/english/quick-tip-hang-out-vs-play/",
    statusCode: 302,
  },
  "blog/english/quick-tip-in-the-way-vs-on-the-way/": {
    path: "https://archive.xlingual.co.jp/blog/english/quick-tip-in-the-way-vs-on-the-way/",
    statusCode: 302,
  },
  "blog/english/quick-tip-poisonous-vs-venomous/": {
    path: "https://archive.xlingual.co.jp/blog/english/quick-tip-poisonous-vs-venomous/",
    statusCode: 302,
  },
  "blog/english/quick-tip-power-vs-strength/": {
    path: "https://archive.xlingual.co.jp/blog/english/quick-tip-power-vs-strength/",
    statusCode: 302,
  },
  "blog/english/quick-tip-present-perfect-greetings/": {
    path: "https://archive.xlingual.co.jp/blog/english/quick-tip-present-perfect-greetings/",
    statusCode: 302,
  },
  "blog/english/reading-is-the-habit-of-champions/": {
    path: "https://archive.xlingual.co.jp/blog/english/reading-is-the-habit-of-champions/",
    statusCode: 302,
  },
  "blog/english/silver-linings-light-in-the-darkness-of-the-coronavirus/": {
    path: "https://archive.xlingual.co.jp/blog/english/silver-linings-light-in-the-darkness-of-the-coronavirus/",
    statusCode: 302,
  },
  "blog/english/superstitions-cross-your-fingers/": {
    path: "https://archive.xlingual.co.jp/blog/english/superstitions-cross-your-fingers/",
    statusCode: 302,
  },
  "blog/english/superstitions-knock-on-wood-why-are-you-knocking/": {
    path: "https://archive.xlingual.co.jp/blog/english/superstitions-knock-on-wood-why-are-you-knocking/",
    statusCode: 302,
  },
  "blog/english/take-this-challenge/": {
    path: "https://archive.xlingual.co.jp/blog/english/take-this-challenge/",
    statusCode: 302,
  },
  "blog/english/tall-vs-high/": {
    path: "https://archive.xlingual.co.jp/blog/english/tall-vs-high/",
    statusCode: 302,
  },
  "blog/english/tea-time-english-conversation/": {
    path: "https://archive.xlingual.co.jp/blog/english/tea-time-english-conversation/",
    statusCode: 302,
  },
  "blog/english/the-benefit-of-community-in-language-learning/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-benefit-of-community-in-language-learning/",
    statusCode: 302,
  },
  "blog/english/the-benefits-of-studying-in-a-group/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-benefits-of-studying-in-a-group/",
    statusCode: 302,
  },
  "blog/english/the-history-behind-saying-bless-you-after-someone-sneezes/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-history-behind-saying-bless-you-after-someone-sneezes/",
    statusCode: 302,
  },
  "blog/english/the-many-uses-of-get-part-1/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-many-uses-of-get-part-1/",
    statusCode: 302,
  },
  "blog/english/the-many-uses-of-get-part-2-to-arrive/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-many-uses-of-get-part-2-to-arrive/",
    statusCode: 302,
  },
  "blog/english/the-many-uses-of-get-part-3-to-understand/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-many-uses-of-get-part-3-to-understand/",
    statusCode: 302,
  },
  "blog/english/the-many-uses-of-get-part-4-to-convince-someone/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-many-uses-of-get-part-4-to-convince-someone/",
    statusCode: 302,
  },
  "blog/english/the-many-uses-of-run-part-1-to-operate/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-many-uses-of-run-part-1-to-operate/",
    statusCode: 302,
  },
  "blog/english/the-many-uses-of-run-part-2-to-manage/": {
    path: "https://archive.xlingual.co.jp/blog/english/the-many-uses-of-run-part-2-to-manage/",
    statusCode: 302,
  },
  "blog/english/to-blame-vs-to-criticize/": {
    path: "https://archive.xlingual.co.jp/blog/english/to-blame-vs-to-criticize/",
    statusCode: 302,
  },
  "blog/english/top-10-mistakes-i-hear-in-class-number-10/": {
    path: "https://archive.xlingual.co.jp/blog/english/top-10-mistakes-i-hear-in-class-number-10/",
    statusCode: 302,
  },
  "blog/english/top-10-mistakes-i-hear-in-class-number-9/": {
    path: "https://archive.xlingual.co.jp/blog/english/top-10-mistakes-i-hear-in-class-number-9/",
    statusCode: 302,
  },
  "blog/english/trends-and-strategies-for-the-new-eiken-test/": {
    path: "https://archive.xlingual.co.jp/blog/english/trends-and-strategies-for-the-new-eiken-test/",
    statusCode: 302,
  },
  "blog/english/verb-ing-for-future-really/": {
    path: "https://archive.xlingual.co.jp/blog/english/verb-ing-for-future-really/",
    statusCode: 302,
  },
  "blog/english/verb-ing-is-only-used-for-actions-happening-right-now/": {
    path: "https://archive.xlingual.co.jp/blog/english/verb-ing-is-only-used-for-actions-happening-right-now/",
    statusCode: 302,
  },
  "blog/english/whats-a-flipper-common-nicknames-for-household-objects/": {
    path: "https://archive.xlingual.co.jp/blog/english/whats-a-flipper-common-nicknames-for-household-objects/",
    statusCode: 302,
  },
  "blog/english/when-no-means-thats-right/": {
    path: "https://archive.xlingual.co.jp/blog/english/when-no-means-thats-right/",
    statusCode: 302,
  },
  "blog/english/wow-i-just-cant-image-that/": {
    path: "https://archive.xlingual.co.jp/blog/english/wow-i-just-cant-image-that/",
    statusCode: 302,
  },
  "blog/english/you-tripped-in-kyoto-are-you-ok/": {
    path: "https://archive.xlingual.co.jp/blog/english/you-tripped-in-kyoto-are-you-ok/",
    statusCode: 302,
  },
  "blog/english/your-english-is-good-but-are-you-being-understood-by-your-patients/":
    {
      path: "https://archive.xlingual.co.jp/blog/english/your-english-is-good-but-are-you-being-understood-by-your-patients/",
      statusCode: 302,
    },
  "courses/regular-english-elementary/": {
    path: "/courses/english/elementary-regular-english",
    statusCode: 301,
  },
  "courses/regular-english-intermediate/": {
    path: "/courses/english/intermediate-regular-english",
    statusCode: 301,
  },
  "courses/regular-english-advanced/": {
    path: "/courses/english/advanced-regular-english",
    statusCode: 301,
  },
  "courses/business-english-elementary/": {
    path: "/courses/english/elementary-general-business-english",
    statusCode: 301,
  },
  "courses/business-english-intermediate/": {
    path: "/courses/english/intermediate-general-business-english",
    statusCode: 301,
  },
  "courses/business-english-advanced/": {
    path: "/courses/english/advanced-general-business-english",
    statusCode: 301,
  },
  "courses/presentation-english/": {
    path: "/courses/english/presentation-english",
    statusCode: 301,
  },
  "courses/doctors-english/": {
    path: "/courses/english/english-for-doctors",
    statusCode: 301,
  },
  "courses/nurses-english/": {
    path: "/courses/english/english-for-doctors",
    statusCode: 301,
  },
};
/*
auth redirects
course redirects
experiences redirects
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
  "": {
    path: "",
    statusCode: 301,
  },
};

*/
