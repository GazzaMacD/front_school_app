import React from "react";

import { useLoaderData } from "@remix-run/react";
import { type V2_MetaFunction, type LoaderArgs, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getTitle } from "~/common/utils";
import { ClassPricePlanTable } from "~/components/prices";
import { getGlobalEnv } from "~/common/utils";

/**
 * Helper functions
 */

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: getTitle({
        title: "Price Plans・料金プラン",
        isHome: false,
      }),
    },
  ];
};
/**
 * Loader and Action functions
 */
export async function loader({ params }: LoaderArgs) {
  const { slug } = params;
  const url = `${BASE_API_URL}/pages/?slug=${slug}&type=products.ClassPricesDetailPage&fields=*`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || !data.items.length) {
    throw new Response("Sorry, 404", { status: 404 });
  }
  const page = data.items[0];
  return json({ page });
}

export default function PricePlansDetailPage() {
  const { page: p } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  return (
    <>
      <header className="pp-dp-header">
        <div className="g-basic-container">
          <div className="pp-dp-header__titles">
            <h1>
              {p.display_title}
              <span>{p.title}</span>
            </h1>
            <p>{p.display_tagline}</p>
          </div>
        </div>
        <div className="pp-dp-header__img-wrap">
          <img
            src={`${ENV.BASE_BACK_URL}${p.header_image.medium.src}`}
            alt={p.header_image.medium.alt}
          />
        </div>
      </header>
    </>
  );
}
