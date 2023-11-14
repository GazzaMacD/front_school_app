import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv, getDateString } from "~/common/utils";

export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=products.LearningExperienceListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=products.LearningExperienceDetailPage&fields=title,display_title,display_tagline,slug,start_date,end_date,header_image`;
    const urls = [lPageUrl, dPageUrl];
    const [lPage, dPage] = await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then(async (res) => {
            return {
              data: await res.json(),
              status: res.status,
              ok: res.ok,
              url: url,
            };
          })
          .catch((error) => ({ error, url }))
      )
    );

    if (!lPage.ok || !dPage.ok || !lPage.data.items.length) {
      throw new Response("Sorry, 404", { status: 404 });
    }
    // filter on end date
    const detailPages = dPage.data.items.filter((page) => {
      const now = new Date(new Date().toDateString()).getTime();
      const end = new Date(page.end_date).getTime();
      return end >= now;
    });

    return json({
      listPage: lPage.data.items[0],
      detailPages,
    });
  } catch (error) {
    //console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function LearningExperiencesIndexPage() {
  const { listPage, detailPages } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  return (
    <div id="lexix">
      <header>
        <hgroup className="lexdp__heading">
          <h1>
            <span>Learning Experiences</span>
            {listPage.display_title}
          </h1>
          <p>{listPage.display_tagline}</p>
        </hgroup>
      </header>
      <section></section>
      <div dangerouslySetInnerHTML={{ __html: listPage.intro }} />
      <section>
        <hgroup className="lexdp__heading">
          <h2>
            <span>Upcoming Learning Experiences</span>
            Upcoming Learning Experiences in Japanese
          </h2>
          <p>Blurb here in Japanese sellling upcoming experiences</p>
        </hgroup>
        <div className="lexix-cards">
          {detailPages.map((page) => {
            const dateString = getDateString(page.start_date, page.end_date);
            return (
              <Link
                className="lexix-card-link"
                key={page.id}
                to={`/learning-experiences/${page.meta.slug}`}
              >
                <article className="lexix-card">
                  <img
                    src={`${ENV.BASE_BACK_URL}${page.header_image.thumbnail.src}`}
                    alt={page.header_image.thumbnail.alt}
                  />
                  <div className="lexix-card__details">
                    <p>{dateString}</p>
                    <h3>{page.display_title}</h3>
                    <p>{page.display_tagline}</p>
                    <button>Learn more..</button>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
      <section>
        <hgroup className="lexdp__heading">
          <h2>
            <span>Learning Experiences Photos</span>
            Learning Experience Photos (日本語)
          </h2>
          <p>Blurb here about photos</p>
        </hgroup>
        <div className="lexix__photos">
          {listPage.experiences_gallery.map((figure) => {
            return (
              <figure key={figure.id} className="lexix__figure">
                <img
                  src={`${ENV.BASE_BACK_URL}${figure.value.image.medium.src}`}
                  alt={figure.value.image.medium.alt}
                />
                <figcaption>{figure.value.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}
