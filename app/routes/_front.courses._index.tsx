import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";

export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=courses.CourseDisplayListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=courses.CourseDisplayDetailPage&fields=_,title,display_title,slug,id,subject_slug`;
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
    return json({
      listPage: lPage.data.items[0],
      dPages: dPage.data.items,
    });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function CoursesIndexPage() {
  const { listPage: lp, dPages: dp } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();

  return (
    <>
      <header className="container">
        <hgroup className="heading1">
          <h1>
            <span>{lp.title}</span>
            {lp.display_title}
          </h1>
          <p>{lp.display_tagline}</p>
        </hgroup>
      </header>
      <section>
        <hgroup>
          <h2>
            <span>{lp.en_sec_title}</span>
            <br />
            {lp.en_sec_dis_title}
          </h2>
        </hgroup>
        <section>
          <h3>{lp.en_sec_pop_title}</h3>
          <div>
            {lp.pop_en_courses.map((cs) => {
              return (
                <Link
                  key={cs.id}
                  to={`/courses/${cs.course.subject_slug}/${cs.course.slug}`}
                >
                  <article>
                    <img
                      src={`${ENV.BASE_BACK_URL}${cs.course.image.thumbnail.src}`}
                      alt={cs.course.image.thumbnail.alt}
                    />
                    <section>
                      <hgroup>
                        <h4>
                          {cs.course.title} <br /> {cs.course.display_title}
                        </h4>
                      </hgroup>
                    </section>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
        <section>
          <h3>{lp.en_sec_other_title}</h3>
          <div>
            {dp.map((cs) => {
              return (
                <Link
                  key={cs.id}
                  to={`/courses/${cs.subject_slug}/${cs.meta.slug}`}
                >
                  <div>
                    {cs.title}
                    <br />
                    {cs.display_title}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </>
  );
}
