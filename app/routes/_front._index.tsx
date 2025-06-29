import type { LinksFunction, MetaFunction } from "@remix-run/node";
import * as React from "react";
import { json } from "@remix-run/node";
import swipperStyles from "swiper/css";
import swipperNavStyles from "swiper/css/navigation";
import { Link, useLoaderData } from "@remix-run/react";
import { FaArrowRightLong, FaXmark, FaRegCircle } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import homeStyles from "~/styles/home.css";
import cardStyles from "~/styles/components/cards.css";
import { StaffRoundPicCard } from "~/components/cards";
import {
  getJapaneseDurationString,
  getTitle,
  getDisplay,
  removeHTMLTags,
  getGlobalEnv,
} from "~/common/utils";
import { Swoosh1 } from "~/components/swooshes";
import { BASE_API_URL, HOME_URL } from "~/common/constants.server";
import {
  RoundButtonLink,
  LgBiButtonLink,
  SolidPillButtonLink,
} from "~/components/buttons";
import { HeadingOne } from "~/components/headings";
import { type THeaderImage } from "~/common/types";

// server side functions
export const meta: MetaFunction = ({ data }) => {
  const { home } = data;
  return [
    { title: getTitle({ title: "", isHome: true }) },
    {
      name: "description",
      content: removeHTMLTags(home.why_content),
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swipperNavStyles },
  { rel: "stylesheet", href: swipperStyles },
  { rel: "stylesheet", href: homeStyles },
  { rel: "stylesheet", href: cardStyles },
];

export const loader = async () => {
  const homeUrl = `${BASE_API_URL}/pages/?type=home.homepage&fields=*`;
  const blogslUrl = `${BASE_API_URL}/pages/?order=-published_date&limit=8&type=lessons.LessonDetailPage&fields=_,id,slug,display_title,display_tagline,published_date,title,category,header_image,id`;
  //campaign urls
  const simpleBannerUrl = `${BASE_API_URL}/pages/?type=campaigns.CampaignSimpleBannerPage&order=-start_date&limit=3&fields=*`;
  const imageBannerUrl = `${BASE_API_URL}/pages/?type=campaigns.CampaignImageBannerPage&order=-start_date&limit=3&fields=_,banner_image,slug,title,start_date,end_date,name_ja,campaign_page_type`;

  const urls = [homeUrl, blogslUrl, simpleBannerUrl, imageBannerUrl];
  const [home, blogs, simpleBanner, imageBanner] = await Promise.all(
    urls.map((url) =>
      fetch(url)
        .then(async (r) => {
          return {
            data: await r.json(),
            status: r.status,
            ok: r.ok,
          };
        })
        .then((data) => {
          return {
            data: data.data,
            status: data.status,
            ok: data.ok,
            url: url,
          };
        })
        .catch((error) => ({ error, url }))
    )
  );

  const campaigns = [
    ...simpleBanner.data.items,
    ...imageBanner.data.items,
  ].filter((campaign) => {
    const now = Date.now();
    const start = new Date(campaign.start_date).getTime();
    const end = new Date(campaign.end_date).getTime();
    if (start <= now && end >= now) {
      return true;
    }
    return false;
  });

  return json({
    home: home.data.items[0],
    blogs: blogs.data.items,
    campaigns,
  });
};

// --------------------------------//
// client side functions
export default function Index() {
  const { home, blogs, campaigns } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
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

  let pricesNumSlides = getNumSlides(windowSize);

  let sliderSpace =
    windowSize > 1536
      ? 120
      : windowSize > 1024
      ? 80
      : windowSize > 768
      ? 40
      : 20;
  let blogNumSlides = windowSize > 1400 ? 4 : windowSize > 1024 ? 3 : 2;
  let blogSlideGap = getBlogSlideGap(windowSize);

  return (
    <>
      <section id="video-banner">
        <div className="ho-hero ">
          <div className="ho-hero__video-wrapper">
            <video className="ho-hero__video" playsInline autoPlay muted loop>
              <source
                src="/video/2024-06-banner-video-2.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="ho-hero__promo">
            <p className="ho-hero__en-title">
              Learn English with our{" "}
              <span className="ho-hero__en-title--green">multilingual</span>{" "}
              expert teachers
            </p>
            <h1 className="ho-hero__ja-title">
              <span>XLingual - エクスリンガル語学学校 -</span>
              マルチリンガルの講師たちと一緒に英語を勉強しましょう
            </h1>
          </div>
        </div>
      </section>

      {campaigns.length ? (
        <section id="campaigns">
          <div className="g-basic-container">
            <HeadingOne
              enText="Current Campaigns"
              jpText="現在実施中のキャンペーン"
              align="center"
              bkground="light"
              level="h2"
            />
            <div className="ho-campaigns">
              {campaigns.map((c) => {
                if (c.campaign_page_type === "image_banner") {
                  return (
                    <BannerImageCard
                      key={c.id}
                      image={c.banner_image}
                      slug={c.meta.slug}
                      nameJa={c.name_ja}
                      baseUrl={ENV.BASE_BACK_URL}
                    />
                  );
                } else if (c.campaign_page_type === "simple_banner") {
                  return (
                    <SimpleBannerCard
                      key={c.id}
                      slug={c.meta.slug}
                      colorType={c.color_type}
                      nameJa={c.name_ja}
                      offer={c.offer}
                      startDate={c.start_date}
                      endDate={c.end_date}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section id="why">
        <div className="g-grid-container1 ho-why">
          <div className="ho-why__img-wrapper">
            <img
              src={`${ENV.BASE_BACK_URL}${home.why_image.medium.src}`}
              alt={home.why_image.medium.alt}
            />
          </div>
          <div className="ho-why__details">
            <HeadingOne
              enText={home.why_en_title}
              jpText={home.why_jp_title}
              align="left"
              bkground="light"
              level="h2"
            />

            <div dangerouslySetInnerHTML={{ __html: home.why_content }}></div>
          </div>
        </div>
      </section>

      <section id="services">
        <Swoosh1 backColor="cream" swooshColor="brown" />
        <div className="ho-services">
          <div className="g-grid-container1">
            <div className="ho-services__heading">
              <HeadingOne
                enText={home.service_en_title}
                jpText={home.service_jp_title}
                align="left"
                bkground="green"
                level="h2"
              />
            </div>
            {home.service_cards.map((service, i) => {
              return (
                <article
                  key={service.id}
                  className={`ho-services__card card${i}`}
                >
                  <div className="ho-services__card__img-wrap">
                    <img
                      className="ho-services__card__img"
                      src={`${ENV.BASE_BACK_URL}${service.value.image.medium.src}`}
                      alt={service.value.image.medium.alt}
                    />
                  </div>
                  <div className="ho-services__details">
                    <h3>{service.value.title}</h3>
                    <p>{service.value.text}</p>
                    <Link to={service.value.link}>詳しく見る</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="ho-tests">
          <div className="g-grid-container1 ">
            <div className="ho-tests__heading">
              <HeadingOne
                enText={home.testimonial_en_title}
                jpText={home.testimonial_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>
          </div>
          {home.home_testimonials.map((t, i) => {
            return (
              <article className="g-grid-container2 ho-test" key={t.id}>
                <div className="ho-test__detail">
                  <p className="ho-test__detail__lead">
                    {t.testimonial.lead_sentence}
                  </p>
                  <h3 className="ho-test__detail__person">
                    {t.testimonial.occupation}
                    <span>{t.testimonial.customer_name}</span>
                  </h3>
                  <div
                    className="ho-test__detail__comment"
                    dangerouslySetInnerHTML={{
                      __html: t.testimonial.comment,
                    }}
                  />
                </div>
                <div className="ho-test__img-wrapper">
                  <div>
                    <img
                      className="ho-test__img"
                      src={`${ENV.BASE_BACK_URL}${t.testimonial.image.medium.src}`}
                      alt={t.testimonial.image.medium.alt}
                    />
                  </div>
                  <div className="ho-test__button-wrapper">
                    <RoundButtonLink
                      to={`/testimonials/${t.testimonial.slug}`}
                      en="Video Interview"
                      jp="ビデオインタビューを見る"
                      color="orange"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="prices">
        <div className="g-grid-container2">
          <div className="ho-prices">
            <div className="ho-prices__heading">
              <HeadingOne
                enText={home.price_en_title}
                jpText={home.price_jp_title}
                align="left"
                bkground="dark"
                level="h2"
              />
            </div>
            <div className="ho-prices__wrapper">
              <Swiper
                // install Swiper modules
                modules={[Navigation]}
                spaceBetween={sliderSpace}
                slidesPerView={pricesNumSlides}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {home.home_class_prices.map((p) => {
                  const cp = p.class_price;
                  const pi = p.class_price.price_info;
                  return (
                    <SwiperSlide key={p.id}>
                      <article className="ho-price">
                        <div>
                          <h3>{cp.title}</h3>
                        </div>
                        <p>{cp.display_title}</p>
                        <table>
                          <tbody>
                            <tr>
                              <td>料金</td>
                              <td>￥{pi.posttax_price}</td>
                            </tr>
                            <tr>
                              <td>時間</td>
                              <td>
                                {cp.length}
                                {getDisplay(cp.length_unit, 1)}
                              </td>
                            </tr>
                            <tr>
                              <td>頻度</td>
                              <td>
                                {getDisplay(cp.quantity_unit, 1)}
                                {cp.quantity}回
                              </td>
                            </tr>
                            <tr>
                              <td>最大人数</td>
                              <td>{cp.max_num}</td>
                            </tr>
                            <tr>
                              <td>ネイティブ講師</td>
                              <td>
                                {cp.is_native ? <FaRegCircle /> : <FaXmark />}
                              </td>
                            </tr>
                            <tr>
                              <td>オンライン受講</td>
                              <td>
                                {cp.is_online ? <FaRegCircle /> : <FaXmark />}
                              </td>
                            </tr>
                            <tr>
                              <td>対面受講</td>
                              <td>
                                {cp.is_inperson ? <FaRegCircle /> : <FaXmark />}
                              </td>
                            </tr>
                            <tr>
                              <td>オンラインレッスンノート</td>
                              <td>
                                {cp.has_onlinenotes ? (
                                  <FaRegCircle />
                                ) : (
                                  <FaXmark />
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>オンライン予約</td>
                              <td>
                                {cp.bookable_online ? (
                                  <FaRegCircle />
                                ) : (
                                  <FaXmark />
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
            <div className="ho-prices__button-wrapper">
              <LgBiButtonLink
                to="/price-plans"
                color="orange"
                jp="すべてのプランを見る"
                en="View All Plans"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="teachers">
        <div className="ho-teachers">
          <div className="g-grid-container1">
            <div className="ho-teachers__heading">
              <HeadingOne
                enText={home.teacher_en_title}
                jpText={home.teacher_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>
            {home.home_teachers.map((item, i) => {
              const teacher = item.teacher;
              return (
                <div key={teacher.id} className={`ho-teacher__card card${i}`}>
                  <StaffRoundPicCard
                    url={`/staff/${teacher.slug}`}
                    src={`${ENV.BASE_BACK_URL}${teacher.image.thumbnail.src}`}
                    alt={teacher.image.original.alt}
                    name={teacher.display_name}
                    tagline={teacher.display_tagline}
                  />
                </div>
              );
            })}
            <div className="ho-teachers__more">
              <SolidPillButtonLink to="/about#teachers" color="green">
                すべての講師を見る &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FaArrowRightLong />
              </SolidPillButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section id="blog-lessons">
        <div className="ho-blog-lessons">
          <div className="g-grid-container1">
            <div className="ho-blog-lessons__heading">
              <HeadingOne
                enText={home.bloglesson_en_title}
                jpText={home.bloglesson_jp_title}
                align="left"
                bkground="light"
                level="h2"
              />
            </div>
            <div className="ho-blog__slider-wrapper">
              <Swiper
                // install Swiper modules
                modules={[Navigation]}
                spaceBetween={blogSlideGap}
                slidesPerView={blogNumSlides}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {blogs.map((blog, i) => {
                  const d = new Date(blog.published_date);
                  return (
                    <SwiperSlide key={blog.id}>
                      <Link
                        className="ho-blog-link"
                        to={`/blog-lessons/${blog.meta.slug}`}
                      >
                        <div className="ho-blog__card">
                          <div className="ho-blog__card-img-wrapper">
                            <img
                              className="ho-blog__card-img"
                              src={`${ENV.BASE_BACK_URL}${blog.header_image.medium.src}`}
                              alt={blog.header_image.medium.alt}
                            />
                            <div className="ho-blog__card-overlay">
                              <div className="ho-blog__card-overlay-inner">
                                <h3>Let's Learn!</h3>
                                <p>記事を読む</p>
                                <FaArrowRightLong />
                              </div>
                            </div>
                          </div>
                          <div className="ho-blog__card-details">
                            <div>
                              <p>{`${d.getFullYear()}.${
                                d.getMonth() + 1
                              }.${d.getDate()}`}</p>
                              <p>[ {blog.category.ja_name} ]</p>
                            </div>
                            <h3>{blog.display_title}</h3>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
            <div className="ho-blog__more">
              <SolidPillButtonLink to="/blog-lessons" color="green">
                すべての記事を見る &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FaArrowRightLong />
              </SolidPillButtonLink>
            </div>
          </div>
        </div>
        <Swoosh1 swooshColor="beige" backColor="white" />
      </section>
    </>
  );
}

/* helper functions */
function getBlogSlideGap(windowSize: number) {
  if (windowSize > 2000) return 110;
  else if (windowSize > 1800) return 103;
  else if (windowSize > 1700) return 96;
  else if (windowSize > 1600) return 90;
  else if (windowSize > 1535) return 85;
  else if (windowSize > 1500) return 89;
  else if (windowSize > 1400) return 83;
  else if (windowSize > 1300) return 77;
  else if (windowSize > 1200) return 71;
  else if (windowSize > 1100) return 63;
  else if (windowSize > 1023) return 60;
  else if (windowSize > 1000) return 185;
  else if (windowSize > 900) return 164;
  else if (windowSize > 800) return 145;
  else if (windowSize > 700) return 48;
  else if (windowSize > 600) return 36;
  else if (windowSize > 500) return 29;
  else if (windowSize > 400) return 27;
  else if (windowSize > 300) return 20;
  else return 20;
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

/**
 * Components
 */
type TBannerImageCardProps = {
  slug: string;
  image: THeaderImage;
  nameJa: string;
  baseUrl: string;
};

function BannerImageCard({
  slug,
  image,
  nameJa,
  baseUrl,
}: TBannerImageCardProps) {
  return (
    <Link to={`/campaigns/${slug}`} className="ho-campaigns__link">
      <div className="ho-campaigns__card">
        <img src={`${baseUrl}/${image.thumbnail.src}`} alt={`${nameJa}`} />
      </div>
    </Link>
  );
}

// SimpleBannerCard

type TSimpleBannerCardProps = {
  slug: string;
  colorType: "lightblue";
  nameJa: string;
  offer: string;
  startDate: string;
  endDate: string;
};

function SimpleBannerCard({
  slug,
  colorType,
  nameJa,
  offer,
  startDate,
  endDate,
}: TSimpleBannerCardProps) {
  const duration = getJapaneseDurationString(startDate, endDate);
  return (
    <Link to={`/campaigns/${slug}`} className={`ho-campaigns__link`}>
      <div className={`ho-campaigns__card ${colorType}`}>
        <h4 className={`ho-campaigns-sb__name ${colorType}`}>
          {nameJa}
          <span>キャンペーン</span>
        </h4>
        <p className={`ho-campaigns-sb__offer ${colorType}`}>{offer}</p>
        <p className={`ho-campaigns-sb__duration ${colorType}`}>
          期間: {duration}
        </p>
      </div>
    </Link>
  );
}
