import React from "react";

import { useLoaderData } from "@remix-run/react";
import {
  json,
  type V2_MetaFunction,
  type LinksFunction,
} from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getTitle } from "~/common/utils";
import { ClassPricePlanTable } from "~/components/prices";
import pageStyles from "~/styles/components/pages.css";
import { SlidingHeaderPage } from "~/components/pages";
import { HeadingOne } from "~/components/headings";

/**
 * Helper functions
 */
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageStyles },
];

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

/**
 *  Page
 */

export default function PricePlansIndexPage() {
  const {
    listPage: lp,
    privateClasses: pc,
    regularClasses: rc,
  } = useLoaderData<typeof loader>();
  return (
    <SlidingHeaderPage
      mainTitle={lp.title}
      subTitle={lp.display_title}
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <section id="private">
        <div className="pp-lp-private">
          <div className="pp-lp-private__intro">
            <div className="g-basic-container">
              <HeadingOne
                enText={lp.private_en_title}
                jpText={lp.private_jp_title}
                align="left"
                bkground="light"
                level="h2"
              />
              <div dangerouslySetInnerHTML={{ __html: lp.private_intro }} />
            </div>
          </div>
          <div>
            {lp.private_price_plans.map((item) => {
              const p = item.price_plan;
              const pi = item.price_plan.price_info;
              return (
                <div key={item.id}>
                  <ClassPricePlanTable
                    color="beige"
                    slug={p.slug}
                    titleEn={p.title}
                    titleJa={p.display_title}
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
              );
            })}
          </div>
        </div>
      </section>
    </SlidingHeaderPage>
  );
}
