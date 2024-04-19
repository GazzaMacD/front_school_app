import {
  type LinksFunction,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";

import aboutStyles from "../styles/about.css";
import { BASE_API_URL } from "~/common/constants.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: aboutStyles },
];

export async function loader({ params }: LoaderFunctionArgs) {
  return redirect("/");
  /*
  const { slug } = params;
  try {
    const testimonialsUrl = `${BASE_API_URL}/pages/?type=testimonials.TestimonialDetailPage&fields=*`;
    const testimonialRes = await fetch(testimonialsUrl);
    const testimonialData = await testimonialRes.json();
    return json({
      testimonials: testimonialData.items,
    });
  } catch (error) {
    throw new Response("sorry, that is a 500", { status: 500 });
  }
  */
}
/*
export default function TestimonialsIndexPage() {
  const { testimonials } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  return (
    <>
      <hgroup>
        <p>Testimonials and Interviews</p>
        <h1>お客様の声と面接</h1>
      </hgroup>
      <section>
        {testimonials.map((t) => {
          return (
            <article key={t.id}>
              <header>
                <div>
                  <img
                    src={`${ENV.BASE_BACK_URL}${t.customer_image.thumbnail.src}`}
                    alt={t.customer_image.thumbnail.alt}
                  />
                </div>
                <div className="test-testimonial__headtext">
                  {t.occupation && (
                    <p className="test-testimonial__occu">{t.occupation}</p>
                  )}
                  {t.organization_name && (
                    <p className="test-testimonial__org">
                      {t.organization_name}
                    </p>
                  )}
                </div>
              </header>
              <div>
                <p>{t.comment}</p>
                <Link to={`/testimonials/${t.meta.slug}`}>
                  Watch interview with customer
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
*/
