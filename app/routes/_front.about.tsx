import { type LinksFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";

import { SlidingHeaderPage } from "~/components/pages";
import aboutStyles from "~/styles/about.css";
import pageCStyles from "~/styles/components/pages.css";
import { BASE_API_URL } from "~/common/constants.server";
import { HeadingOne } from "~/components/headings";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: aboutStyles },
  { rel: "stylesheet", href: pageCStyles },
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
        <section>
          <h2>{page.staff_title}</h2>
          <p>{page.staff_tagline}</p>
          <div>
            {page.staff_members.map((member) => {
              return (
                <div key={member.id}>
                  <div>
                    <img
                      src={`${ENV.BASE_BACK_URL}${member.staff.image.original.src}`}
                      alt={member.staff.image.original.alt}
                    />
                    <div>
                      <p>{member.staff.intro}</p>
                      <Link to={`/staff/${member.staff.slug}`}>
                        More about {member.staff.name}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <h3>{member.staff.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <h2>{page.values_title}</h2>
          <p>{page.values_tagline}</p>
          <div>
            {page.values_content.map((block) => {
              if (block.type === "rich_text") {
                return (
                  <div
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.value }}
                  />
                );
              }
              if (block.type === "value_cards") {
                return block.value.cards.map((card) => {
                  return (
                    <div key={card.title}>
                      <img
                        src={`${ENV.BASE_BACK_URL}${card.image.medium.src}`}
                        alt={card.image.medium.alt}
                      />
                    </div>
                  );
                });
              }
            })}
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
