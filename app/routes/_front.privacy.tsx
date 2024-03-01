import { type LinksFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { SlidingHeaderPage } from "~/components/pages";
import { BASE_API_URL } from "~/common/constants.server";
import pageCStyles from "~/styles/components/pages.css";
import singlesStyles from "~/styles/about.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: singlesStyles },
  { rel: "stylesheet", href: pageCStyles },
];

export async function loader() {
  const url = `${BASE_API_URL}/pages/?type=singles.PrivacyPage&slug=privacy&fields=*`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || !data.items.length) {
      throw new Response("Oops that's a 404", { status: 404 });
    }
    const page = data.items[0];
    return json({ page });
  } catch (error) {
    throw new Response("Oops that's a 500", { status: 500 });
  }
}

export default function PrivacyPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <>
      <SlidingHeaderPage
        mainTitle={page.title}
        subTitle={page.display_title}
        swooshBackColor="cream"
        swooshFrontColor="beige"
      >
        <section id="content">
          <div className="si-privacy">
            <div className="g-narrow-container">
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
          </div>
        </section>
      </SlidingHeaderPage>
    </>
  );
}
