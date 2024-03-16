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
      <header>
        <h1>
          <span>{lp.title}</span>
          {lp.display_title}
        </h1>
        <p>{lp.display_tagline}</p>
      </header>
    </>
  );
}
