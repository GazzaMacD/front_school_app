import React from "react";
import { type LinksFunction, type LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";

import aboutStyles from "../styles/about.css";
import { BASE_API_URL } from "~/common/constants.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: aboutStyles },
];

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;
  try {
    const testimonialsUrl = `${BASE_API_URL}/pages/?type=testimonials.TestimonialDetailPage&slug=${slug}&fields=*`;
    const testimonialRes = await fetch(testimonialsUrl);
    const testimonialData = await testimonialRes.json();
    return json({
      testimonial: testimonialData.items[0],
    });
  } catch (error) {
    throw new Response("sorry, that is a 500", { status: 500 });
  }
}

export default function TestimonialsDetailPage() {
  const { testimonial } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  return (
    <div className="container">
      <header className="test-testimonial__header">
        <hgroup>
          <p>Testimonial and Interview - {testimonial.title}</p>
          <h1>お客様の声と面接 - {testimonial.customer_name}</h1>
        </hgroup>
        <div className="test-testimonial__headimage">
          <img
            className="test-testimonial__image"
            src={`${ENV.BASE_BACK_URL}${testimonial.customer_image.thumbnail.src}`}
            alt={testimonial.customer_image.thumbnail.alt}
          />
        </div>
        <div className="test-testimonial__headtext">
          {testimonial.occupation && (
            <p className="test-testimonial__occu">{testimonial.occupation}</p>
          )}
          {testimonial.organization_name && (
            <p className="test-testimonial__org">
              {testimonial.organization_name}
            </p>
          )}
        </div>
      </header>

      <div>
        <p className="test-testimonial__comment">{testimonial.comment}</p>
      </div>
      <section>
        {testimonial.customer_interview.map((block) => {
          if (block.type === "youtube") {
            return (
              <div key={block.id} className="container">
                <iframe
                  className={`youtube-iframe ${
                    block.value.short ? "youtube-short" : ""
                  }`}
                  src={`${block.value.src}?modestbranding=1&controls=0&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          } else if (block.type === "conversation") {
            const p1 = block.value.person_one_name;
            const p2 = block.value.person_two_name;
            return (
              <div key={block.id} className="text-container">
                <div className="l-conv">
                  <h4 className="l-conv__title">{block.value.title}</h4>
                  <p>{block.value.intro}</p>
                  <table className="l-conv__table">
                    {block.value.conversation.map((lines: any) => {
                      return (
                        <React.Fragment key={lines.person_one.slice(0, 6)}>
                          <tr>
                            <td>{p1}</td>
                            <td>:</td> <td>{lines.person_one}</td>
                          </tr>
                          <tr>
                            <td>{p2}</td>
                            <td>:</td> <td>{lines.person_two}</td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </table>
                </div>
              </div>
            );
          }
        })}
      </section>
    </div>
  );
}
