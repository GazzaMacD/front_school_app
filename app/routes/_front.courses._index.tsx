import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
/*
export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=languageschools.LanguageSchoolListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=languageschools.LanguageSchoolDetailPage&fields=title,display_title,ls`;
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
*/

export default function CoursesIndexPage() {
  //const { listPage: lp, dPages: dp } = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <h1>Courses List Page</h1>
    </div>
  );
}
