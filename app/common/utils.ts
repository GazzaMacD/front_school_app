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
 * String functions
 */
export function removeHTMLTags(html: string): string {
  if (typeof html !== "string") {
    return "";
  }
  return html.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, "");
}

/*
 * Date and time functions
 */

export function getJapaneseDurationString(s: string, e: string): string {
  const start = new Date(s);
  const end = new Date(e);
  const startString = `${start.getFullYear()}年${
    start.getMonth() + 1
  }月${start.getDate()}日`;
  const endString = `${end.getFullYear()}年${
    end.getMonth() + 1
  }月${end.getDate()}日`;
  return `${startString} ~ ${endString}`;
}

export function getDateString(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let dateString: string;
  if (startDate.getTime() === endDate.getTime()) {
    dateString = `${startDate.getFullYear()}.${
      startDate.getMonth() + 1
    }.${startDate.getDate()}`;
  } else {
    dateString = `${startDate.getFullYear()}.${
      startDate.getMonth() + 1
    }.${startDate.getDate()} ~ ${endDate.getFullYear()}.${
      endDate.getMonth() + 1
    }.${endDate.getDate()}`;
  }
  return dateString;
}

export function getDateStringWithDays(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dateString: string;
  if (startDate.getTime() === endDate.getTime()) {
    dateString = `${startDate.getFullYear()}.${
      startDate.getMonth() + 1
    }.${startDate.getDate()} (${days[startDate.getDay()]})`;
  } else {
    dateString = `${startDate.getFullYear()}.${
      startDate.getMonth() + 1
    }.${startDate.getDate()} (${
      days[startDate.getDay()]
    }) ~ ${endDate.getFullYear()}.${
      endDate.getMonth() + 1
    }.${endDate.getDate()} (${days[endDate.getDay()]})`;
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
  "blog/list/": {
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
    path: "/courses/english/english-for-nurses",
    statusCode: 301,
  },
  "courses/meeeting-english/": {
    path: "/courses/english/meeting-english",
    statusCode: 301,
  },
  "courses/courses/specialized-eiken/": {
    path: "/courses/english/specialized-eiken-course",
    statusCode: 301,
  },
  "courses/toeic-native-course/": {
    path: "/courses/english/native-taught-toeic-preparation",
    statusCode: 301,
  },
  "courses/email-writing/": {
    path: "/courses/english/english-email-writing-course",
    statusCode: 301,
  },
  //experiences
  "exciting-learning-experience/": {
    path: "/courses/english/english-email-writing-course",
    statusCode: 301,
  },
  //learning centers
  "learning-centers/": {
    path: "/language-schools",
    statusCode: 301,
  },
  "learning-centers/hanamizukidori-school/": {
    path: "/language-schools/hanamizukidori",
    statusCode: 301,
  },
  "learning-centers/miyoshi-school/": {
    path: "/language-schools/miyoshigaoka",
    statusCode: 301,
  },
  "learning-centers/fushimi-school/": {
    path: "language-schools/fushimi",
    statusCode: 301,
  },
  //price plans
  "prices/": {
    path: "/price-plans",
    statusCode: 301,
  },
  "prices/eighty-minute-group/": {
    path: "/price-plans/80-minute-group",
    statusCode: 301,
  },
  "prices/fifty-minute-group/": {
    path: "/price-plans/50-minute-group",
    statusCode: 301,
  },
  "prices/community-group/": {
    path: "/price-plans/community-centre-group",
    statusCode: 301,
  },
  "prices/business-email/": {
    path: "/price-plans/writing-class",
    statusCode: 301,
  },
  "prices/private-charter/": {
    path: "/price-plans/private-charter",
    statusCode: 301,
  },
  "prices/private-man-to-man/": {
    path: "/price-plans/premium-private",
    statusCode: 301,
  },
  "prices/private-online/": {
    path: "/price-plans/private-online",
    statusCode: 301,
  },
  // contact
  "contact/": {
    path: "/contact",
    statusCode: 301,
  },
  // auth redirects
  "accounts/login": {
    path: "/login",
    statusCode: 301,
  },
  "accounts/reset-password": {
    path: "/password-reset",
    statusCode: 301,
  },
  "accounts/sign-up": {
    path: "/register",
    statusCode: 301,
  },
};

export const videoLessonRedirects: TRedirects = {
  "how-hollywood-actors-play-their-roles": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/how-hollywood-actors-play-their-roles/",
    statusCode: 302,
  },
  "english-is-essential-for-entrepreneurs": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/english-is-essential-for-entrepreneurs/",
    statusCode: 302,
  },
  "kevin-oleary-my-morning-routine": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/kevin-oleary-my-morning-routine/",
    statusCode: 302,
  },
  "words-to-describe-exciting-careers": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/words-to-describe-exciting-careers/",
    statusCode: 302,
  },
  "reid-hoffman-how-i-work": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/reid-hoffman-how-i-work/",
    statusCode: 302,
  },
  "origami-inspires-tiny-medical-devices": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/origami-inspires-tiny-medical-devices/",
    statusCode: 302,
  },
  "wild-hamster-has-a-graveyard-feast": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/wild-hamster-has-a-graveyard-feast/",
    statusCode: 302,
  },
  "a-day-in-the-life-of-a-neurosurgeon": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/a-day-in-the-life-of-a-neurosurgeon/",
    statusCode: 302,
  },
  "how-to-properly-set-up-your-desk": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/how-to-properly-set-up-your-desk/",
    statusCode: 302,
  },
  "the-mummification-process/": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/the-mummification-process/",
    statusCode: 302,
  },
  "incident-between-us-police-and-soldier": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/incident-between-us-police-and-soldier/",
    statusCode: 302,
  },
  "covid-19-vaccine-side-effects": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/covid-19-vaccine-side-effects/",
    statusCode: 302,
  },
  "bridget-van-kralingen-how-i-work": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/bridget-van-kralingen-how-i-work/",
    statusCode: 302,
  },
  "tired-eyes-this-may-be-why": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/tired-eyes-this-may-be-why/",
    statusCode: 302,
  },
  "how-to-get-a-job-the-values-of-ceos": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/how-to-get-a-job-the-values-of-ceos/",
    statusCode: 302,
  },
  "prepositions-mr-beans-awkward-drive": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/prepositions-mr-beans-awkward-drive/",
    statusCode: 302,
  },
  "the-edible-water-bottle": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/the-edible-water-bottle/",
    statusCode: 302,
  },
  "should-you-wear-earbuds-in-the-summer": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/should-you-wear-earbuds-in-the-summer/",
    statusCode: 302,
  },
  "sue-desmond-hellman-how-i-work": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/sue-desmond-hellman-how-i-work/",
    statusCode: 302,
  },
  "kevin-oleary-my-sunday-routine": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/kevin-oleary-my-sunday-routine/",
    statusCode: 302,
  },
  "joseph-swedish-how-i-work": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/joseph-swedish-how-i-work/",
    statusCode: 302,
  },
  "guy-kawasaki-lessons-on-innovation": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/guy-kawasaki-lessons-on-innovation/",
    statusCode: 302,
  },
  "richard-lovett-how-i-work": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/richard-lovett-how-i-work/",
    statusCode: 302,
  },
  "becoming-a-first-class-flight-attendant": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/becoming-a-first-class-flight-attendant/",
    statusCode: 302,
  },
  "cyclone-seroja-causes-hundreds-of-deaths": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/cyclone-seroja-causes-hundreds-of-deaths/",
    statusCode: 302,
  },
  "immunity-and-vaccines-explained": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/immunity-and-vaccines-explained/",
    statusCode: 302,
  },
  "eu-decision-due-on-astrazeneca-vaccine": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/eu-decision-due-on-astrazeneca-vaccine/",
    statusCode: 302,
  },
  "elle-fannings-homonyms": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/elle-fannings-homonyms/",
    statusCode: 302,
  },
  "covid-19-deaths-obesity-link": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/covid-19-deaths-obesity-link/",
    statusCode: 302,
  },
  "eu-vaccine-roll-out": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/eu-vaccine-roll-out/",
    statusCode: 302,
  },
  "france-to-ease-lockdown-restrictions": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/france-to-ease-lockdown-restrictions/",
    statusCode: 302,
  },
  "trump-accepts-formal-transition": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/trump-accepts-formal-transition/",
    statusCode: 302,
  },
  "deadly-texas-storm": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/deadly-texas-storm/",
    statusCode: 302,
  },
  "saudi-activist-set-free": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/saudi-activist-set-free/",
    statusCode: 302,
  },
  "myanmar-military-coup": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/myanmar-military-coup/",
    statusCode: 302,
  },
  "trump-impeachment-trial": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/trump-impeachment-trial/",
    statusCode: 302,
  },
  "conflict-in-ethiopia": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/conflict-in-ethiopia/",
    statusCode: 302,
  },
  "counting-the-cost-of-covid": {
    path: "https://archive.xlingual.co.jp/courses/video-lesson/counting-the-cost-of-covid/",
    statusCode: 302,
  },
};
