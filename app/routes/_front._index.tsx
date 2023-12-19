import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import homeStyles from "../styles/home.css";
import { getTitle } from "~/common/utils";
import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { ButtonLink } from "~/components/buttons";

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
            <ButtonLink to="/courses">Courses</ButtonLink>
            <ButtonLink to="/learning-experiences" variant="secondary">
              Experiences
            </ButtonLink>
          </div>
        </div>
      </section>

      <hr></hr>
      <section id="popular">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Why learn with us</h2>
          <p className="bsection-group__subheading">なぜ私たちと学ぶのか</p>
          <p>140 char tagline here in Japanese (seo focused)</p>
        </hgroup>
        <p>
          ------------- Picture here of team with explanation of our philosophy
          on learning languages and link or button to about us page
          -------------
        </p>
      </section>

      <hr></hr>
      <section id="popular">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Our Services</h2>
          <p className="bsection-group__subheading">私たちのサービス</p>
          <p>140 char tagline here in Japanese (seo focused)</p>
        </hgroup>
        <p>
          -------- Our 4 main Servics here with brief, attractive explanation of
          each service with link button to relevant pages 1. Business English
          learning 2. General English learning 3. English Exam preparation 4.
          Language learning experiences (education events where use english to
          teach and communicate) -------------
        </p>
      </section>

      <hr></hr>
      <section id="testimonials" className="full-width-container">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Customer Testimonials</h2>
          <p className="bsection-group__subheading">お客様の声</p>
          <p>140 char tagline here in Japanese (seo focused)</p>
        </hgroup>
        <div>
          <p>
            --------testimonials from students with links to the whole page
            which has video interview-------------
          </p>
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
      <hr></hr>

      <section id="popular">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Most popular prices</h2>
          <p className="bsection-group__subheading">人気クラスの料</p>
          <p>140 char tagline here in Japanese (seo focused)</p>
        </hgroup>
        <p>
          -------- Our most popular 3 class prices in table form with link or
          button to /class-prices -------------
        </p>
      </section>

      <hr></hr>
      <section id="experiences">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Learn from our free blogs</h2>
          <p className="bsection-group__subheading">無料ブログレッスンで学</p>
          <p>140 char tagline here in Japanese (seo focused)</p>
        </hgroup>
        <p>
          List of top 5 / 7 latest blog lesson posts where we teach for free to
          our community
        </p>
        <p>
          + Area for form to subscribe to our email to stay uptodate with our
          latest learning posts and instagram learning
        </p>
      </section>
    </>
  );
}
