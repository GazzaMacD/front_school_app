import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";

export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=languageschools.LanguageSchoolListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=languageschools.LanguageSchoolDetailPage&fields=title,display_title,lc`;
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
  const { listPage: lp, dPages: dp } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{lp.display_title}</h1>
      <div dangerouslySetInnerHTML={{ __html: lp.display_intro }} />
      <div>
        {dp.map((school) => {
          const address = school.lc.address;
          return (
            <Link to={`/language-schools/${school.meta.slug}`} key={school.id}>
              <div>
                <p>{school.display_title}英会話教室</p>
                <h3>{school.title} Language School</h3>
                <p>{address.code}</p>
                <p>{address.state}</p>
                <p>{address.city}</p>
                {address.line_two && <p>{address.line_two}</p>}
                <p>{address.line_one}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
