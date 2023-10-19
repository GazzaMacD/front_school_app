import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import homeStyles from "../styles/home.css";
import { getTitle } from "~/common/utils";
import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";

// server side functions
export const meta: V2_MetaFunction = () => {
  return [{ title: getTitle({ title: "", isHome: true }) }];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles },
];

export const loader = async () => {
  try {
    const testimonialsUrl = `${BASE_API_URL}/pages/?type=testimonials.TestimonialDetailPage&fields=slug,customer_name,customer_image,occupation,organization_name,comment&limit=10`;
    const testimonialRes = await fetch(testimonialsUrl);
    const testimonialData = await testimonialRes.json();
    return json({
      testimonials: testimonialData.items,
    });
  } catch (error) {
    throw new Response("sorry, that is a 500", { status: 500 });
  }
};

// --------------------------------//
// client side functions
export default function Index() {
  const { testimonials } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
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
            <button className="button ">Courses</button>
            <button className="button button--orange">Experiences</button>
          </div>
        </div>
      </section>

      <section id="why">
        <hgroup className="bsection-group why__heading">
          <h2 className="bsection-group__heading">Why learn with us?</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
        <div className="why__wrapper">
          <div className="why-point"></div>
          <div className="why-point"></div>
          <div className="why-point"></div>
        </div>
      </section>

      <section id="testimonials" className="full-width-container">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Customer Testimonials</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
        <div>
          <h3>On Google</h3>
        </div>
        <div>
          <h3>On our site</h3>
          <div className="test-students">
            {testimonials.length &&
              testimonials.map((testimonial) => {
                return (
                  <article key={testimonial.id} className="test-testimonial">
                    <header className="test-testimonial__header">
                      <div className="test-testimonial__headimage">
                        <img
                          className="test-testimonial__image"
                          src={`${ENV.BASE_BACK_URL}${testimonial.customer_image.thumbnail.src}`}
                          alt={testimonial.customer_image.thumbnail.alt}
                        />
                      </div>
                      <div className="test-testimonial__headtext">
                        <h4 className="test-testimonial__name">
                          {testimonial.customer_name}
                        </h4>
                        {testimonial.occupation && (
                          <p className="test-testimonial__occu">
                            {testimonial.occupation}
                          </p>
                        )}
                        {testimonial.organization_name && (
                          <p className="test-testimonial__org">
                            {testimonial.organization_name}
                          </p>
                        )}
                      </div>
                    </header>
                    <p className="test-testimonial__comment">
                      {testimonial.comment.length > 40
                        ? `${testimonial.comment.slice(0, 40)}...`
                        : testimonial.comment}
                      <Link
                        className="test-testimonial__link"
                        to={`/testimonials/${testimonial.meta.slug}`}
                      >
                        Read more and watch interview
                      </Link>
                    </p>
                  </article>
                );
              })}
          </div>
        </div>
      </section>

      <section id="popular">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Most popular courses</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
      </section>

      <section id="voice">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Student voice</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
      </section>

      <section id="experiences">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Meet us in an experience</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
      </section>
    </>
  );
}
