import React from "react";

import { useLoaderData } from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { ClassPricePlanTable } from "~/components/prices";
import { getGlobalEnv } from "~/common/utils";

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;
  try {
    const url = `${BASE_API_URL}/pages/?slug=${slug}&type=products.ClassPricesDetailPage&fields=*`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !data.items.length) {
      throw new Response("Sorry, 404", { status: 404 });
    }
    const page = data.items[0];
    return json({ page });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function PricePlansDetailPage() {
  const { page: p } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  return (
    <div>
      <header>
        <hgroup>
          <h1>
            <span>{p.title} </span>
            {p.display_title}
          </h1>
          <p>{p.display_tagline}</p>
        </hgroup>
        <img
          src={`${ENV.BASE_BACK_URL}${p.header_image.original.src}`}
          alt={p.header_image.original.alt}
        />
      </header>
      <section>
        <hgroup>
          <h2>
            <span>Class Details</span>
            クラスの詳細
          </h2>
        </hgroup>
        {p.class_intro.map((block) => (
          <div
            key={block.id}
            dangerouslySetInnerHTML={{ __html: block.value }}
          />
        ))}

        <div>
          <ClassPricePlanTable />
        </div>
      </section>
    </div>
  );
}
