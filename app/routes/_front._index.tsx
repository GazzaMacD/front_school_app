import type { LinksFunction, MetaFunction } from "@remix-run/node";
import * as React from "react";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FaArrowRightLong, FaXmark, FaRegCircle } from "react-icons/fa6";

import { BASE_API_URL } from "~/common/constants.server";
import homeStyles from "~/styles/home.css?url";
import cardStyles from "~/styles/components/cards.css?url";
import { StaffRoundPicCard } from "~/components/cards";
import { getTitle, getGlobalEnv, getDisplay } from "~/common/utils";
import { Swoosh1 } from "~/components/swooshes";
import {
  RoundButtonLink,
  LgBiButtonLink,
  SolidPillButtonLink,
} from "~/components/buttons";
import { HeadingOne } from "~/components/headings";

// server side functions
export const meta: MetaFunction = () => {
  return [{ title: getTitle({ title: "", isHome: true }) }];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles },
  { rel: "stylesheet", href: cardStyles },
];

export const loader = async () => {
  const homeUrl = `${BASE_API_URL}/pages/?type=home.HomePage&fields=*`;
  const blogslUrl = `${BASE_API_URL}/pages/?order=-published_date&limit=8&type=lessons.LessonDetailPage&fields=_,id,slug,display_title,display_tagline,published_date,title,category,header_image`;
  const urls = [homeUrl, blogslUrl];
  const [home, blogs] = await Promise.all(
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

  return json({
    home: home.data.items[0],
    blogs: blogs.data.items,
  });
};

// --------------------------------//
// client side functions
export default function Index() {
  const { home, blogs } = useLoaderData<typeof loader>();
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
              {/* This was Swiper container */}
              <div>
                ** THis was slider **
                {home.home_class_prices.map((p) => {
                  const cp = p.class_price;
                  const pi = p.class_price.price_info;
                  return (
                    <div key={p.id}>
                      {/* This was Swiper SLide */}
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
                    </div>
                  );
                })}
              </div>
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
              <div>
                ** Was swiper **
                {/* This was Swiper container */}
                {blogs.map((blog, i) => {
                  const d = new Date(blog.published_date);
                  return (
                    <div key={blog.id}>
                      {/* This was Swiper Slider container */}
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
                    </div>
                  );
                })}
              </div>
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
