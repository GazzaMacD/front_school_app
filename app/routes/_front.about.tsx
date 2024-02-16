import { type LinksFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";

import { SlidingHeaderPage } from "~/components/pages";
import { BASE_API_URL } from "~/common/constants.server";
import { HeadingOne } from "~/components/headings";
import { StaffRoundPicCard, NumberedHorizontalCards } from "~/components/cards";
import aboutStyles from "~/styles/about.css";
import pageCStyles from "~/styles/components/pages.css";
import cardStyles from "~/styles/components/cards.css";
import { getDivisor4LetterHash } from "~/common/utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: aboutStyles },
  { rel: "stylesheet", href: pageCStyles },
  { rel: "stylesheet", href: cardStyles },
];

export async function loader() {
  const aboutAPIUrl = `${BASE_API_URL}/pages/?type=about.AboutPage&slug=about&fields=*`;
  try {
    const response = await fetch(aboutAPIUrl);
    const aboutPageData = await response.json();
    if (!response.ok || !aboutPageData.items.length) {
      throw new Response("Oops that's a 404", { status: 404 });
    }
    const page = aboutPageData.items[0];
    return json({ page });
  } catch (error) {
    return null;
  }
}

export default function AboutPage() {
  const { page } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();

  const teacherHash = getDivisor4LetterHash(page.staff_members.length);
  return (
    <>
      <SlidingHeaderPage
        mainTitle={page.title}
        subTitle={page.display_title}
        swooshBackColor="cream"
        swooshFrontColor="beige"
      >
        <section>
          <div className="ab-mission">
            <div className="g-narrow-container">
              <HeadingOne
                enText={page.mission_en_title}
                jpText={page.mission_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
              <h2>{page.mission_title}</h2>
              <p>{page.mission_tagline}</p>
              <p>{page.mission_content}</p>
            </div>
          </div>
        </section>
        <section id="teachers">
          <div className="ab-teachers">
            <div className="g-grid-container1">
              <div className="ab-teachers__heading">
                <HeadingOne
                  enText={page.staff_en_title}
                  jpText={page.staff_jp_title}
                  align="center"
                  bkground="light"
                  level="h2"
                />
              </div>
              {page.staff_members.length ? (
                page.staff_members.map((member, i) => {
                  return (
                    <div
                      key={member.id}
                      className={`ab-teachers__card-wrapper ${teacherHash[i]}`}
                    >
                      <StaffRoundPicCard
                        url={`/staff/${member.staff.slug}`}
                        src={`${ENV.BASE_BACK_URL}${member.staff.image.original.src}`}
                        alt={member.staff.image.original.alt}
                        name={member.staff.name}
                        tagline={member.staff.display_tagline}
                      />
                    </div>
                  );
                })
              ) : (
                <p>Please at least one staff member</p>
              )}
            </div>
          </div>
        </section>

        <section id="values">
          <div className="ab-values">
            <div className="g-narrow-container">
              <HeadingOne
                enText={page.values_en_title}
                jpText={page.values_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
              <div dangerouslySetInnerHTML={{ __html: page.values_intro }} />
            </div>
            <div className="g-grid-container1">
              {page.values_list.map((block, i) => {
                const classType = i % 2;
                return (
                  <div
                    key={block.id}
                    className={`ab-values__card-wrapper t${classType}`}
                  >
                    <NumberedHorizontalCards
                      number={`0${i + 1}`}
                      enTitle={block.value.title}
                      jaTitle={block.value.jp_title}
                      text={block.value.text}
                      src={`${ENV.BASE_BACK_URL}${block.value.image.thumbnail.src}`}
                      alt={block.value.image.medium.alt}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <h2>{page.history_title}</h2>
          <p>{page.history_tagline}</p>
          <div>
            {page.history_content.map((block) => {
              if (block.type === "rich_text") {
                return (
                  <div
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );
              }
            })}
          </div>
        </section>
      </SlidingHeaderPage>
    </>
  );
}
