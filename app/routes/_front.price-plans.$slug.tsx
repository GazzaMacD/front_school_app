import React from "react";

import { useLoaderData } from "@remix-run/react";
import { type V2_MetaFunction, type LoaderArgs, json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getTitle } from "~/common/utils";
import { ClassPricePlanTable } from "~/components/prices";
import { getGlobalEnv } from "~/common/utils";
import { HeadingOne } from "~/components/headings";
import { Swoosh1 } from "~/components/swooshes";

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
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || !data.items.length) {
    throw new Response("Sorry, 404", { status: 404 });
  }
  const page = data.items[0];
  return json({ page });
}

export default function PricePlansDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  const p = page.class_service;
  const pi = page.class_service.price_info;
  const ENV = getGlobalEnv();
  return (
    <>
      <header className="pp-dp-header">
        <div className="g-basic-container">
          <div className="pp-dp-header__titles">
            <h1>
              {page.display_title}
              <span>{page.title}</span>
            </h1>
            <p>{page.display_tagline}</p>
          </div>
        </div>
        <div className="pp-dp-header__img-wrap">
          <img
            src={`${ENV.BASE_BACK_URL}${page.header_image.medium.src}`}
            alt={page.header_image.medium.alt}
          />
        </div>
      </header>

      <section id="about">
        <div className="g-narrow-container">
          <HeadingOne
            enText="About Plan"
            jpText="プランについて"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        <div className="pp-dp-about__intro">
          {page.class_intro.map((block: any) => {
            if (block.type === "rich_text") {
              return (
                <div
                  className="g-narrow-container"
                  key={block.id}
                  dangerouslySetInnerHTML={{ __html: block.value }}
                />
              );
            } else if (block.type === "text_width_img") {
              return (
                <div key={block.id} className="g-narrow-container">
                  <figure className="pp-dp-about__img-wrapper text-width">
                    <img
                      src={`${ENV.BASE_BACK_URL}${block.value.image.original.src}`}
                      alt={block.value.image.original?.alt}
                    />
                    {block.value?.caption ? (
                      <figcaption>{block.value.caption}</figcaption>
                    ) : null}
                  </figure>
                </div>
              );
            } else if (block.type === "youtube") {
              return (
                <div key={block.id}>
                  <div className="pp-dp-intro__youtube">
                    <iframe
                      className={`g-youtube-iframe ${
                        block.value.short ? "g-youtube-short" : ""
                      }`}
                      src={`${block.value.src}?modestbranding=1&controls=0&rel=0`}
                      title="YouTube video player"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="pp-dp-about__price">
          <ClassPricePlanTable
            color="beige"
            showLinkButton={false}
            slug={p.slug}
            titleEn={page.title}
            titleJa={page.display_title}
            duration={p.length}
            durationUnit={p.length_unit}
            stdQuantity={p.quantity}
            stdQuantityUnit={p.quantity_unit}
            maxNum={p.max_num}
            isNative={p.is_native}
            isOnline={p.is_online}
            isInperson={p.is_inperson}
            hasOnlineNotes={p.has_onlinenotes}
            bookableOnline={p.bookable_online}
            preTaxPrice={pi.pretax_price}
            postTaxPrice={pi.posttax_price}
            onSale={pi.is_sale}
            preSalePreTaxPrice={pi.before_sale_pretax_price}
            preSalePostTaxPrice={pi.before_sale_posttax_price}
            priceStartDate={pi.start_date}
            priceEndDate={pi.end_date}
          />
        </div>
      </section>
      <Swoosh1 swooshColor="beige" backColor="cream" />
    </>
  );
}
