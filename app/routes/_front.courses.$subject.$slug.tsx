import * as React from "react";

import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
  type LinksFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Swiper, SwiperSlide } from "swiper/react";
import swipperStyles from "swiper/css";
import swipperNavStyles from "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { BsFillBarChartFill, BsGlobe, BsJournalText } from "react-icons/bs";

import { BASE_API_URL } from "~/common/constants.server";
import {
  getGlobalEnv,
  getTitle,
  getDivisor4LetterHash,
  videoLessonRedirects,
} from "~/common/utils";
import { HeadingOne } from "~/components/headings";
import { Swoosh1 } from "~/components/swooshes";
import { DetailLinkCard } from "~/components/cards";
import { ClassPricePlanTable } from "~/components/prices";
import pricesStyles from "~/styles/components/prices.css";

/**
 * Helper functions
 */
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swipperStyles },
  { rel: "stylesheet", href: swipperNavStyles },
  { rel: "stylesheet", href: pricesStyles },
];

export const meta: MetaFunction = ({ data }) => {
  const { page } = data;
  return [
    { title: getTitle({ title: `${page.display_title}`, isHome: false }) },
  ];
};

/*
 * Loader and Action functions
 */

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { subject, slug } = params;
  if (subject === "video-lesson" && slug && slug in videoLessonRedirects) {
    return redirect(
      videoLessonRedirects[slug].path,
      videoLessonRedirects[slug].statusCode
    );
  }
  const apiUrl = `${BASE_API_URL}/pages/?type=courses.CourseDisplayDetailPage&subject_slug=${subject}&slug=${slug}&fields=*`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Response(`Oops sorry that's a ${response.status}`, {
      status: response.status,
    });
  }
  const pagesData = await response.json();
  if (!pagesData.items.length) {
    throw new Response("Oops sorry that's a 404", {
      status: 404,
    });
  }
  const page = pagesData.items[0];
  return json({ page });
}
/**
 * Page
 */

export default function CourseDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const subject = page.course.subject as "english" | "japanese" | "french";
  const subjectDisplay = page.course.subject_display.split(",");
  const categoryDisplay = page.course.course_category_display.split(",");
  const levelFromDisplay = page.level_from.display.split(",");
  const levelToDisplay = page.level_to.display.split(",");
  const relatedHash = getDivisor4LetterHash(page.related_courses.length);

  /* slider related */
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
    windowSize > 1000
      ? 80
      : windowSize > 800
      ? 60
      : windowSize > 600
      ? 40
      : windowSize > 400
      ? 30
      : 20;

  let pricesNumSlides =
    windowSize > 1000
      ? 2.5
      : windowSize > 800
      ? 2
      : windowSize > 600
      ? 2
      : windowSize > 400
      ? 1.5
      : 1.2;

  return (
    <>
      <header className="cs-dp-header">
        <div className="g-basic-container">
          <div className="cs-dp-header__titles">
            <h1>
              {page.display_title}
              <span>{page.title}</span>
            </h1>
            <p>{page.display_tagline}</p>
          </div>
          <div className="cs-dp-header__info">
            <div>
              <BsGlobe />
              <span>言語 :</span>
              <span>
                {subject === "japanese" ? subjectDisplay[1] : subjectDisplay[2]}
              </span>
            </div>
            <div>
              <BsJournalText />
              <span>コース種別 :</span>
              <span>
                {subject === "japanese"
                  ? categoryDisplay[0]
                  : categoryDisplay[1]}
              </span>
            </div>
            <div>
              <BsFillBarChartFill />
              <span>レベル :</span>
              <span>
                {subject === "japanese"
                  ? levelFromDisplay[0]
                  : levelFromDisplay[1]}
                {page.level_to.number < 2 ||
                page.level_to.number <= page.level_from.number
                  ? ""
                  : subject === "japanese"
                  ? ` ~ ${levelToDisplay[0]}`
                  : ` ~ ${levelToDisplay[1]}`}
              </span>
            </div>
          </div>
        </div>
        <div className="cs-dp-header__img-wrap">
          <img
            src={`${ENV.BASE_BACK_URL}${page.header_image.medium.src}`}
            alt={page.header_image.medium.alt}
          />
        </div>
      </header>

      <section id="skills">
        <div className="g-narrow-container">
          <HeadingOne
            enText="What skills will I learn"
            jpText="学べるスキルの例"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        <div className="g-basic-container">
          <div className="cs-dp-skills">
            <ul>
              {page.course_content_points.map((sk, i) => {
                const num = i > 8 ? i + 1 : `0${i + 1}`;
                return (
                  <li key={sk.id} className="cs-dp-skills__skill">
                    <div>{num}</div>
                    <div>{sk.value.text}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="g-narrow-container">
          <HeadingOne
            enText="About course"
            jpText="このコースについて"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        {page.course_description.map((block: any) => {
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
                <figure className="cs-dp-about__img-wrapper text-width">
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
                <div className="cs-dp-intro__youtube">
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
      </section>

      <section id="plans">
        <div className="g-basic-container">
          <HeadingOne
            enText="Popular Price Plans"
            jpText="人気のプラン"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        {windowSize > 1300 ? (
          <div className="g-basic-container">
            <div className="cs-dp-plans__large-wrapper">
              {page.common_price_plans.map((item, i) => {
                const p = item.price_plan;
                const pi = item.price_plan.price_info;
                return (
                  <div key={item.id} className="cs-dp-plans__plan">
                    <ClassPricePlanTable
                      color="beige"
                      showLinkButton={true}
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
        ) : (
          <div className="g-basic-container">
            <div className="cs-dp-swiper__wrapper">
              <Swiper
                modules={[Navigation]}
                spaceBetween={sliderSpace}
                slidesPerView={pricesNumSlides}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log("slide change")}
              >
                {page.common_price_plans.map((item) => {
                  const p = item.price_plan;
                  const pi = item.price_plan.price_info;
                  return (
                    <SwiperSlide key={item.id}>
                      <ClassPricePlanTable
                        color="beige"
                        showLinkButton={true}
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
        )}
      </section>

      <section id="related">
        <div className="cs-dp-related">
          <div className="g-grid-container1">
            <div className="cs-dp-related__heading">
              <h2>その他のおすすめコース</h2>
            </div>
            {page.related_courses.map((c, i) => {
              return (
                <div
                  key={c.id}
                  className={`cs-dp-related__card ${relatedHash[i]}`}
                >
                  <DetailLinkCard
                    title={c.course.display_title}
                    tagline={c.course.display_tagline}
                    src={`${ENV.BASE_BACK_URL}${c.course.image.thumbnail.src}`}
                    alt={`${c.course.image.thumbnail.alt}`}
                    url={`/courses/${c.course.subject_slug}/${c.course.slug}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Swoosh1 swooshColor="beige" backColor="white" />
    </>
  );
}
