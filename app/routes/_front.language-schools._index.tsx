import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json, type MetaFunction } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { getTitle } from "~/common/utils";
import { SlidingHeaderPage } from "~/components/pages";
import pageStyles from "~/styles/components/pages.css";

/**
 *  Utils and helper functions
 */
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageStyles },
];

export const meta: MetaFunction = () => {
  return [
    { title: getTitle({ title: "Language Schools・語学学校", isHome: false }) },
  ];
};

/**
 * Server functions
 */
export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=languageschools.LanguageSchoolListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=languageschools.LanguageSchoolDetailPage&fields=_,id,title,display_title,display_tagline,slug,display_city,header_image`;
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
    if (!lPage.data.items.length || !dPage.data.items.length) {
      throw new Response("Oops, that is not found", { status: 404 });
    }
    return json({
      listPage: lPage.data.items[0],
      dPages: dPage.data.items,
    });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function LanguageSchoolsListPage() {
  const ENV = getGlobalEnv();
  const { listPage: lp, dPages: dp } = useLoaderData<typeof loader>();

  return (
    <SlidingHeaderPage
      mainTitle={lp.title}
      subTitle={lp.display_title}
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      {/* 
      <div className="ls-lp-intro">
        <div
          className="g-narrow-container"
          dangerouslySetInnerHTML={{ __html: lp.display_intro }}
        />
      </div>*/}
      <section className="ls-lp-schools">
        <div className="g-grid-container1">
          {dp.map((school, i) => {
            return (
              <article key={school.id} className={`ls-lp-school t${i % 2}`}>
                <div className="ls-lp-school__img-wrap">
                  <img
                    src={`${ENV.BASE_BACK_URL}${school.header_image.thumbnail.src}`}
                    alt={school.display_title}
                  />
                </div>
                <div className="ls-lp-school__details">
                  <div className="ls-lp-school__heading">
                    <h3>{school.display_title}校</h3>
                    <p>愛知県{school.display_city}</p>
                  </div>
                  <p className="ls-lp-school__tagline">
                    {school.display_tagline}
                  </p>
                  <Link
                    className="ls-lp-school__link"
                    to={`/language-schools/${school.meta.slug}`}
                    key={school.id}
                  >
                    詳しく見る
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </SlidingHeaderPage>
  );
}

/*
    <div>
      <h1>{lp.title}</h1>
      <p>{lp.display_title}</p>
      <div dangerouslySetInnerHTML={{ __html: lp.display_intro }} />
      <div>
        {dp.map((school) => {
          return (
            <Link
              className="ls-lp-school"
              to={`/language-schools/${school.meta.slug}`}
              key={school.id}
            >
              <article>
                <p>{school.display_title}語学学校</p>
                <h3>{school.title} Language School</h3>
                <p>{school.display_city}</p>
                <img
                  src={`${ENV.BASE_BACK_URL}${school.header_image.thumbnail.src}`}
                  alt={school.display_title}
                />
              </article>
            </Link>
          );
        })}
      </div>
    </div>
    */
