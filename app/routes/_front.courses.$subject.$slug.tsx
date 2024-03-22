import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { FaGlobe, FaArrowUpWideShort } from "react-icons/fa6";
import { BsFillBarChartFill, BsGlobe, BsJournalText } from "react-icons/bs";

/*
 * types
 */

/*
 * server functions
 */

export async function loader({ request, params }: LoaderArgs) {
  try {
    const { subject, slug } = params;
    const apiUrl = `${BASE_API_URL}/pages/?type=courses.CourseDisplayDetailPage&subject_slug=${subject}&slug=${slug}&fields=*`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error", { cause: response.status });
    }
    const pagesData = await response.json();
    if (!pagesData.items.length) {
      // slug query string returned no page == 404
      throw new Response("Oops sorry we can't seem to find that page", {
        status: 404,
      });
    }
    const page = pagesData.items[0];
    return { page };
  } catch (error) {
    throw new Response("Oops sorry something went wrong", {
      status: 500,
    });
  }
}
/**
 * Page
 */

export default function CourseDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const subject = page.course.subject as "english" | "japanese" | "french";
  const subjectDisplay = page.course.subject_display.split(",");
  const categoryDisplay = page.course.course_category_display.split(",");
  const levelFromDisplay = page.level_from.display.split(",");
  const levelToDisplay = page.level_to.display.split(",");
  return (
    <>
      <header className="cs-dp-header">
        <div className="g-basic-container">
          <div className="cs-dp-header__titles">
            <h1>
              {page.display_title}
              <span>{page.title}</span>
            </h1>
            <p>{page.display_tagline}</p>
          </div>
          <div className="cs-dp-header__info">
            <div>
              <BsGlobe />
              <span>言語 : </span>
              <span>
                {subject === "japanese" ? subjectDisplay[1] : subjectDisplay[2]}
              </span>
            </div>
            <div>
              <BsJournalText />
              <span>コース種別 : </span>
              <span>
                {subject === "japanese"
                  ? categoryDisplay[0]
                  : categoryDisplay[1]}
              </span>
            </div>
            <div>
              <BsFillBarChartFill />
              <span>レベル : </span>
              <span>
                {subject === "japanese"
                  ? levelFromDisplay[0]
                  : levelFromDisplay[1]}
                {page.level_to.number < 2 ||
                page.level_to.number <= page.level_from.number
                  ? ""
                  : subject === "japanese"
                  ? ` ~ ${levelToDisplay[0]}`
                  : ` ~ ${levelToDisplay[1]}`}
              </span>
            </div>
          </div>
        </div>
        <div className="cs-dp-header__img-wrap">
          <img
            src={`${ENV.BASE_BACK_URL}${page.header_image.medium.src}`}
            alt={page.header_image.medium.alt}
          />
        </div>
      </header>
    </>
  );
}
