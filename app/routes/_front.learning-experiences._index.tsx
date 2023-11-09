import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";

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
      <h1>{listPage.display_title}</h1>
      <section>
        <h2>Upcoming Learning Experiences</h2>
        <div className="lexix-cards">
          {detailPages.map((page) => {
            const startDate = new Date(page.start_date);
            const endDate = new Date(page.end_date);
            let dateString: string;
            if (startDate.getTime() === endDate.getTime()) {
              dateString = `${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDay()}`;
            } else {
              dateString = `${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDay()} ~ ${endDate.getFullYear()}/${endDate.getMonth()}/${endDate.getDay()}`;
            }
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
        <h2>Previous Learning Experience Photos</h2>
      </section>
    </div>
  );
}
