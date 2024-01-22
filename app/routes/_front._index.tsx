import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import * as React from "react";
import { json } from "@remix-run/node";
import swipperStyles from "swiper/css";
import swipperNavStyles from "swiper/css/navigation";
import { Link, useLoaderData } from "@remix-run/react";
import { FaArrowRightLong, FaXmark, FaRegCircle } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import homeStyles from "../styles/home.css";
import { getTitle } from "~/common/utils";
import { Swoosh1 } from "~/components/swooshes";
import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { ButtonLink, RoundButtonLink } from "~/components/buttons";
import { HeadingOne } from "~/components/headings";
import { getDisplay } from "~/common/utils";

// server side functions
export const meta: V2_MetaFunction = () => {
  return [{ title: getTitle({ title: "", isHome: true }) }];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swipperNavStyles },
  { rel: "stylesheet", href: swipperStyles },
  { rel: "stylesheet", href: homeStyles },
];

export const loader = async () => {
  const homeUrl = `${BASE_API_URL}/pages/?type=home.HomePage&fields=*`;
  const blogslUrl = `${BASE_API_URL}/pages/?order=-published_date&limit=8&type=lessons.LessonDetailPage&fields=_,id,slug,display_title,display_tagline,published_date,title,header_image`;
  const teachersUrl = `${BASE_API_URL}/pages/?type=staff.StaffDetailPage&fields=_,id,title,slug,intro,profile_image&limit=4`;
  const urls = [homeUrl, teachersUrl, blogslUrl];
  try {
    const [home, teachers, blogs] = await Promise.all(
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
    /* NOTE - ERROR HANDLING HERE */

    return json({
      home: home.data.items[0],
      teachers: teachers.data.items,
      blogs: blogs.data.items,
    });
  } catch (error) {
    throw new Response("sorry, that is a 500", { status: 500 });
  }
};

// --------------------------------//
// client side functions
export default function Index() {
  const { home, blogs, teachers } = useLoaderData<typeof loader>();
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

  let sliderSpace =
    windowSize > 1536
      ? 120
      : windowSize > 1024
      ? 80
      : windowSize > 768
      ? 40
      : 20;

  return (
    <>
      <section id="video-banner">
        <div className="vbanner__wrapper">
          <video className="vbanner__video" playsInline autoPlay muted loop>
            <source src="/video/dummy.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="vbanner__promo">
          <div className="vbanner__text">
            <h2 className="vbanner__title">
              Learn English with our{" "}
              <span className="vbanner__yellow">multi</span>
              <span className="vbanner__red">lingual</span> expert teachers.
            </h2>
          </div>
          <div className="vbanner__buttons">
            <ButtonLink to="/courses">Courses</ButtonLink>
            <ButtonLink to="/learning-experiences" variant="secondary">
              Experiences
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="why">
        <div className="container ho-why">
          <div className="ho-why__img-wrapper">
            <div>
              <img
                src={`${ENV.BASE_BACK_URL}${home.why_image.medium.src}`}
                alt={home.why_image.medium.alt}
              />
            </div>
          </div>
          <div>
            <HeadingOne
              enText={home.why_en_title}
              jpText={home.why_jp_title}
              align="left"
              bkground="light"
            />

            <div dangerouslySetInnerHTML={{ __html: home.why_content }}></div>
          </div>
        </div>
      </section>

      <section id="services">
        <Swoosh1 backColor="cream" swooshColor="brown" />
        <div className="ho-services">
          <HeadingOne
            enText={home.service_en_title}
            jpText={home.service_jp_title}
            align="left"
            bkground="dark"
          />
          <div className="ho-services__cards">
            {home.service_cards.map((service) => {
              return (
                <article key={service.id} className="ho-services__card">
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
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="ho-tests container">
          <HeadingOne
            enText={home.testimonial_en_title}
            jpText={home.testimonial_jp_title}
            align="center"
            bkground="light"
          />
          <div>
            {home.home_testimonials.map((t) => {
              return (
                <article className="ho-test" key={t.id}>
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
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="prices">
        <div className="ho-prices">
          <HeadingOne
            enText={home.price_en_title}
            jpText={home.price_jp_title}
            align="left"
            bkground="dark"
          />
          <div className="ho-prices__wrapper">
            <Swiper
              // install Swiper modules
              modules={[Navigation]}
              spaceBetween={sliderSpace}
              slidesPerView={2.5}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log("slide change")}
            >
              {home.home_class_prices.map((p) => {
                const cp = p.class_price;
                const pi = p.class_price.price_info;
                return (
                  <SwiperSlide key={p.id}>
                    <article className="ho-price">
                      <h3>{cp.title}</h3>
                      <p>{cp.display_title}</p>
                      <table>
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
                            {cp.has_onlinenotes ? <FaRegCircle /> : <FaXmark />}
                          </td>
                        </tr>
                        <tr>
                          <td>オンライン予約</td>
                          <td>
                            {cp.bookable_online ? <FaRegCircle /> : <FaXmark />}
                          </td>
                        </tr>
                      </table>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>

      <section id="teachers">
        <div className="ho-teachers">
          <HeadingOne
            enText="Teachers"
            jpText="講師紹介"
            align="center"
            bkground="light"
          />
          <div className="ho-teachers__list">
            {teachers.map((teacher) => {
              return (
                <article key={teacher.id} className="ho-teacher__card">
                  <Link
                    to={`/staff/${teacher.meta.slug}`}
                    className="ho-teacher__card-link"
                  >
                    <div className="ho-teacher__card-img-wrapper">
                      <img
                        className="ho-teacher__card-img"
                        src={`${ENV.BASE_BACK_URL}${teacher.profile_image.thumbnail.src}`}
                        alt={teacher.profile_image.thumbnail.alt}
                      />
                      <div className="ho-teacher__card-overlay">
                        <div className="ho-teacher__card-overlay-inner">
                          <h3>View Details</h3>
                          <p>詳細を見る</p>
                          <FaArrowRightLong />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="ho-teacher__card-details">
                    <h3>{teacher.title}</h3>
                    <p>{teacher.intro}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="blog-lessons">
        <div className="ho-blog-lessons">
          <HeadingOne
            enText="Blog Lessons"
            jpText="読んで学べるブログ"
            align="left"
            bkground="light"
          />
          <div className="ho-blog__slider-wrapper">
            <Swiper
              // install Swiper modules
              modules={[Navigation]}
              spaceBetween={sliderSpace}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log("slide change")}
            >
              {blogs.map((blog, i) => {
                const date = new Date(blog.published_date);
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
                              <h3>Read Blog Lesson</h3>
                              <p>記事を読む</p>
                              <FaArrowRightLong />
                            </div>
                          </div>
                        </div>
                        <div className="ho-blog__card-details">
                          <p>
                            {`${date.getFullYear()}.${
                              date.getMonth() + 1
                            }.${date.getDate()}`}{" "}
                            <span>blog lesson</span>
                          </p>
                          <h3>{blog.display_title}</h3>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
        <Swoosh1 swooshColor="beige" backColor="white" />
      </section>
    </>
  );
}
