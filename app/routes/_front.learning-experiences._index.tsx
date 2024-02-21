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
    <div id="le">
      <header>
        <h1>
          h1 {listPage.title}
          <br />
          <span>{listPage.display_title}</span>
        </h1>
        <div>
          Introduction paragraphs explaining concepts around learning
          experiences
        </div>
        <div dangerouslySetInnerHTML={{ __html: listPage.intro }} />
      </header>

      <section id="upcoming">
        <h2>
          h2 - {listPage.upcoming_en_title}
          <br />
          <span>{listPage.upcoming_jp_title}</span>
        </h2>
        <div>
          {detailPages.map((page) => {
            const dateString = getDateString(page.start_date, page.end_date);
            return (
              <Link
                key={page.id}
                to={`/learning-experiences/${page.meta.slug}`}
              >
                <article>
                  <img
                    src={`${ENV.BASE_BACK_URL}${page.header_image.thumbnail.src}`}
                    alt={page.header_image.thumbnail.alt}
                  />
                  <div>
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

      <section id="gallery">
        <h2>
          h2 - {listPage.gallery_en_title}
          <br />
          <span>{listPage.gallery_jp_title}</span>
        </h2>
        <div className="lexix__photos">
          {listPage.experiences_gallery.map((figure) => {
            return (
              <figure key={figure.id}>
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
