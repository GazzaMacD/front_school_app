import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { SlidingHeaderPage } from "~/components/pages";
import { DetailLinkCard } from "~/components/cards";
import { HeadingOne } from "~/components/headings";
import { FaArrowRightLong } from "react-icons/fa6";
import { getDivisor4LetterHash } from "~/common/utils";
import pageStyles from "~/styles/components/pages.css";
import cardStyles from "~/styles/components/cards.css";

/**
 *  Utils and helper functions
 */
type TCourse = {
  meta: {
    slug: string;
  };
  display_title: string;
  id: number;
  course: {
    id: number;
    title_en: string;
    subject: string;
    subject_display: string;
    course_category: string;
    course_category_display: string;
  };
  subject_slug: string;
};
type TCourses = TCourse[];

type TDict = {
  [key: string]: {
    [key: string]: TCourse[];
  };
};

function createLanguageDictionary(items) {
  const dict: TDict = {};
  items.forEach((item) => {
    if (item.course.subject in dict) {
      if (item.course.course_category in dict[item.course.subject]) {
        dict[item.course.subject][item.course.course_category].push(item);
      } else {
        dict[item.course.subject][item.course.course_category] = [];
        dict[item.course.subject][item.course.course_category].push(item);
      }
    } else {
      dict[item.course.subject] = {};
      dict[item.course.subject][item.course.course_category] = [];
      dict[item.course.subject][item.course.course_category].push(item);
    }
  });
  return dict;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageStyles },
  { rel: "stylesheet", href: cardStyles },
];

/**
 *  Server functions
 */

export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=courses.CourseDisplayListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=courses.CourseDisplayDetailPage&fields=_,id,course,display_title,subject_slug,slug`;
    const urls = [lPageUrl, dPageUrl];
    const [lPage, dPage] = await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then(async (res) => {
            return {
              data: await res.json(),
              status: res.status,
              url: url,
            };
          })
          .catch((error) => ({ error, url }))
      )
    );
    if (lPage.status !== 200 || dPage.status !== 200) {
      throw new Error(JSON.stringify({ lPage, dPage }, null, 2));
    }
    if (!lPage.data.items.length) {
      throw new Response("Oops, that is not found", { status: 404 });
    }
    const langDict = createLanguageDictionary(dPage.data.items);

    return json({
      listPage: lPage.data.items[0],
      langDict,
    });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

/**
 * Page
 */
export default function CoursesIndexPage() {
  const { listPage: lp, langDict: ld } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const popularHash = getDivisor4LetterHash(lp.popular_courses.length);
  const englishHeadings = {
    general: ["a", "日常英会話"],
    business: ["b", "ビジネス英会話"],
    testpreparation: ["c", "英語試験対策"],
    writing: ["d", "英語ライティング"],
  };

  return (
    <SlidingHeaderPage
      mainTitle={lp.title}
      subTitle={lp.display_title}
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <section id="popular">
        <div className="cs-lp-popular">
          <div className="g-grid-container1">
            <div className="cs-lp-popular__heading">
              <HeadingOne
                enText={lp.popular_en_title}
                jpText={lp.popular_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>
            {lp.popular_courses.map((c, i) => {
              return (
                <div
                  key={c.id}
                  className={`cs-lp-popular__card ${popularHash[i]}`}
                >
                  <DetailLinkCard
                    title={c.course.display_title}
                    tagline={c.course.display_tagline}
                    src={`${ENV.BASE_BACK_URL}${c.course.image.thumbnail.src}`}
                    alt={`${c.course.image.thumbnail.alt}`}
                    url={`/courses/${c.course.subject_slug}/${c.course.slug}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="english">
        <div className="cs-lp-language">
          <div className="g-grid-container1">
            <div className="cs-lp-language__heading">
              <HeadingOne
                enText={lp.english_en_title}
                jpText={lp.english_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>
            {Object.entries(englishHeadings).map(([k, v]) => {
              return (
                <div key={k} className={`cs-lp-language__col ${v[0]}`}>
                  <h3>{v[1]}</h3>
                  {ld.english[k] ? (
                    ld.english[k].map((cs) => {
                      return (
                        <Link
                          key={cs.id}
                          to={`/courses/${cs.course.subject}/${cs.meta.slug}`}
                          className="cs-lp-language__link"
                        >
                          {cs.display_title}
                          <FaArrowRightLong />
                        </Link>
                      );
                    })
                  ) : (
                    <p>Coming soon</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SlidingHeaderPage>
  );
}
