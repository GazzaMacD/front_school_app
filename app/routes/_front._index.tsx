import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import homeStyles from "../styles/home.css";
import { getTitle } from "~/common/utils";
import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { ButtonLink } from "~/components/buttons";
import { HeadingOne } from "~/components/headings";

// server side functions
export const meta: V2_MetaFunction = () => {
  return [{ title: getTitle({ title: "", isHome: true }) }];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles },
];

export const loader = async () => {
  const homeUrl = `${BASE_API_URL}/pages/?type=home.HomePage&fields=*`;
  const testimonialsUrl = `${BASE_API_URL}/pages/?type=testimonials.TestimonialDetailPage&fields=slug,customer_name,customer_image,occupation,organization_name,comment&limit=2`;
  const blogslUrl = `${BASE_API_URL}/pages/?order=-published_date&limit=8&type=lessons.LessonDetailPage&fields=_,slug,display_title,display_tagline,published_date,title,header_image`;
  const urls = [homeUrl, testimonialsUrl, blogslUrl];
  try {
    const [home, testimonials, blogs] = await Promise.all(
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
    console.log(blogs);

    return json({
      home: home.data.items[0],
      testimonials: testimonials.data.items,
      blogs: blogs.data.items,
    });
  } catch (error) {
    throw new Response("sorry, that is a 500", { status: 500 });
  }
};

// --------------------------------//
// client side functions
export default function Index() {
  const { home, testimonials, blogs } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  console.log(blogs);

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
        <div className="ho-services-swoosh">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#584019"
              fillOpacity="1"
              d="M0,288L80,256C160,224,320,160,480,154.7C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
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

      <hr></hr>
      <section id="testimonials" className="full-width-container">
        <HeadingOne
          enText="Customer Testimonials"
          jpText="お客様の声"
          align="center"
          bkground="light"
        />
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
        <HeadingOne
          enText="Popular Price Plans"
          jpText="人気プランの料金"
          align="left"
          bkground="light"
        />
        <p>
          -------- Our most popular 3 class prices in table form with link or
          button to /class-prices -------------
        </p>
      </section>

      <hr></hr>
      <section id="teachers">
        <HeadingOne enText="Teachers" jpText="講師紹介" align="center" />
        <p>Introduce staff here</p>
      </section>

      <section id="blog-lessons">
        <HeadingOne
          enText="Blog Lessons"
          jpText="読んで学べるブログ"
          align="left"
        />
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
