import React from "react";

import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { PriceTable } from "~/components/price-table";

export async function loader() {
  try {
    const lPageUrl = `${BASE_API_URL}/pages/?type=products.ClassPricesListPage&fields=*`;
    const dPageUrl = `${BASE_API_URL}/pages/?type=products.ClassPricesDetailPage&fields=title,display_title,class_service`;
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
    if (
      !lPage.ok ||
      !dPage.ok ||
      !lPage.data.items.length ||
      !dPage.data.items.length
    ) {
      throw new Response("Sorry, 404", { status: 404 });
    }
    const privateClasses = [];
    const regularClasses = [];
    dPage.data.items.forEach((page) => {
      if (page.class_service.class_type === "private") {
        privateClasses.push(page);
      }
      if (page.class_service.class_type === "regular") {
        regularClasses.push(page);
      }
    });
    // sort pages into private or regular
    return json({
      listPage: lPage.data.items[0],
      privateClasses,
      regularClasses,
    });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function ClassPricesListPage() {
  const {
    listPage: lp,
    privateClasses: pc,
    regularClasses: rc,
  } = useLoaderData<typeof loader>();
  return (
    <div>
      <header>
        <hgroup>
          <h1>
            <span>{lp.title} </span>
            {lp.display_title}
          </h1>
          <p>{lp.display_tagline}</p>
        </hgroup>
        <div dangerouslySetInnerHTML={{ __html: lp.intro }} />
        <section>
          <hgroup>
            <h2>
              <span>Private Classes </span>
              {lp.private_title}
            </h2>
            <p>{lp.private_tagline}</p>
          </hgroup>
          <div dangerouslySetInnerHTML={{ __html: lp.private_intro }} />
          <div>
            <PriceTable classes={pc} hasLink={true} />
          </div>
        </section>
        <section>
          <hgroup>
            <h2>
              <span>Regular Classes </span>
              {lp.regular_title}
            </h2>
            <p>{lp.regular_tagline}</p>
          </hgroup>
          <div dangerouslySetInnerHTML={{ __html: lp.regular_intro }} />
          <div>
            <PriceTable classes={rc} hasLink={true} />
          </div>
        </section>
      </header>
    </div>
  );
}
