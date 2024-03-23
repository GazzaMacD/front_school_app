import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { BsFillBarChartFill, BsGlobe, BsJournalText } from "react-icons/bs";
import { HeadingOne } from "~/components/headings";
import { Swoosh1 } from "~/components/swooshes";
import { DetailLinkCard } from "~/components/cards";
import { getDivisor4LetterHash } from "~/common/utils";

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
  const relatedHash = getDivisor4LetterHash(page.related_courses.length);
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
              <span>言語 :</span>
              <span>
                {subject === "japanese" ? subjectDisplay[1] : subjectDisplay[2]}
              </span>
            </div>
            <div>
              <BsJournalText />
              <span>コース種別 :</span>
              <span>
                {subject === "japanese"
                  ? categoryDisplay[0]
                  : categoryDisplay[1]}
              </span>
            </div>
            <div>
              <BsFillBarChartFill />
              <span>レベル :</span>
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

      <section id="skills">
        <div className="g-narrow-container">
          <HeadingOne
            enText="What skills will I learn"
            jpText="学べるスキル"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <p>Max 9 skills + one ...nado in list form here</p>
        </div>
      </section>

      <section id="about">
        <div className="g-narrow-container">
          <HeadingOne
            enText="About course"
            jpText="このコースについて"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        {page.course_description.map((block: any) => {
          if (block.type === "rich_text") {
            return (
              <div
                className="g-narrow-container"
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.value }}
              />
            );
          } else if (block.type === "text_width_img") {
            return (
              <div key={block.id} className="g-narrow-container">
                <figure className="cs-dp-about__img-wrapper text-width">
                  <img
                    src={`${ENV.BASE_BACK_URL}${block.value.image.original.src}`}
                    alt={block.value.image.original?.alt}
                  />
                  {block.value?.caption ? (
                    <figcaption>{block.value.caption}</figcaption>
                  ) : null}
                </figure>
              </div>
            );
          } else if (block.type === "youtube") {
            return (
              <div key={block.id}>
                <div className="cs-dp-intro__youtube">
                  <iframe
                    className={`g-youtube-iframe ${
                      block.value.short ? "g-youtube-short" : ""
                    }`}
                    src={`${block.value.src}?modestbranding=1&controls=0&rel=0`}
                    title="YouTube video player"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </section>

      <section id="plans">
        <div className="g-narrow-container">
          <HeadingOne
            enText="Popular Price Plans"
            jpText="人気のプラン"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <p>Three plans here </p>
          <p>Link button to all plans here</p>
        </div>
      </section>

      <section id="related">
        <div className="cs-dp-related">
          <div className="g-grid-container1">
            <div className="cs-dp-related__heading">
              <h2>その他のおすすめコース</h2>
            </div>
            {page.related_courses.map((c, i) => {
              return (
                <div
                  key={c.id}
                  className={`cs-dp-related__card ${relatedHash[i]}`}
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
      <Swoosh1 swooshColor="beige" backColor="white" />
    </>
  );
}
