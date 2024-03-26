import React from "react";

import { useLoaderData } from "@remix-run/react";
import {
  json,
  type V2_MetaFunction,
  type LinksFunction,
} from "@remix-run/node";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { BASE_API_URL } from "~/common/constants.server";
import { getTitle } from "~/common/utils";
import { ClassPricePlanTable } from "~/components/prices";
import { SlidingHeaderPage } from "~/components/pages";
import { HeadingOne } from "~/components/headings";
import pageStyles from "~/styles/components/pages.css";

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

  const [windowSize, setWindowSize] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  });

  const handleWindowResize = React.useCallback((event) => {
    setWindowSize(window.innerWidth);
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleWindowResize]);

  let sliderSpace =
    windowSize > 1536
      ? 120
      : windowSize > 1024
      ? 80
      : windowSize > 768
      ? 40
      : 20;
  let pricesNumSlides = getNumSlides(windowSize);

  return (
    <SlidingHeaderPage
      mainTitle={lp.title}
      subTitle={lp.display_title}
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <section id="private">
        <div className="pp-lp-private">
          <div className="g-basic-container">
            <div className="pp-lp-private__intro">
              <HeadingOne
                enText={lp.private_en_title}
                jpText={lp.private_jp_title}
                align="left"
                bkground="light"
                level="h2"
              />
              <div dangerouslySetInnerHTML={{ __html: lp.private_intro }} />
            </div>
            <div className="pp-lp-swiper__wrapper">
              <Swiper
                // install Swiper modules
                modules={[Navigation]}
                spaceBetween={sliderSpace}
                slidesPerView={pricesNumSlides}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
              >
                {lp.private_price_plans.map((item) => {
                  const p = item.price_plan;
                  const pi = item.price_plan.price_info;
                  return (
                    <SwiperSlide key={item.id}>
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
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </SlidingHeaderPage>
  );
}

function getNumSlides(windowSize: number) {
  if (windowSize > 2000) return 3.5;
  else if (windowSize > 1700) return 3.5;
  else if (windowSize > 1600) return 3.1;
  else if (windowSize > 1535) return 2.5;
  else if (windowSize > 1500) return 2.5;
  else if (windowSize > 1400) return 2.5;
  else if (windowSize > 1400) return 2.5;
  else if (windowSize > 1300) return 2.5;
  else if (windowSize > 1200) return 2.25;
  else if (windowSize > 1100) return 2.3;
  else if (windowSize > 1023) return 1.9;
  else if (windowSize > 1000) return 2.5;
  else if (windowSize > 900) return 2.3;
  else if (windowSize > 800) return 1.8;
  else if (windowSize > 700) return 1.9;
  else if (windowSize > 600) return 1.7;
  else if (windowSize > 500) return 1.5;
  else if (windowSize > 400) return 1.44;
  else if (windowSize > 300) return 1.35;
  else return 1.25;
}
