import React from "react";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";

import { BASE_API_URL } from "~/common/constants.server";
import { Swoosh1 } from "~/components/swooshes";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  const url = `${BASE_API_URL}/pages/?type=testimonials.TestimonialDetailPage&slug=${slug}&fields=*`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || !data.items.length) {
    throw new Response("Sorry, that's a 404.", { status: 404 });
  }
  return json({
    testimonial: data.items[0],
  });
}

export default function TestimonialsDetailPage() {
  const { testimonial } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  return (
    <>
      <header className="te-dp-header">
        <div className="g-grid-container1">
          <div className="te-dp-header__img-wrapper">
            <img
              src={`${ENV.BASE_BACK_URL}${testimonial.customer_portrait_image.thumbnail.src}`}
              alt={testimonial.customer_portrait_image.thumbnail.alt}
            />
          </div>
          <div className="te-dp-header__details">
            <h1>{testimonial.customer_name}</h1>
            {testimonial.occupation && <p>{testimonial.occupation}</p>}
            {testimonial.organization_name && (
              <p className="test-testimonial__org">
                {testimonial.organization_name}
              </p>
            )}
          </div>
        </div>
      </header>

      <section id="testimonial">
        <div>
          <div
            className="g-narrow-container"
            dangerouslySetInnerHTML={{ __html: testimonial.comment }}
          />
        </div>
      </section>

      <section id="interview">
        {testimonial.customer_interview.map((block) => {
          if (block.type === "youtube") {
            return (
              <div key={block.id} className="g-basic-container">
                <div className="te-dp-interview__video">
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
          } else if (block.type === "conversation") {
            const p1 = block.value.person_one_name;
            const p2 = block.value.person_two_name;
            return (
              <div key={block.id} className="g-narrow-container">
                <div className="te-dp-interview__text">
                  <h4>{block.value.title}</h4>
                  <p>{block.value.intro}</p>
                  <table className="te-dp-interview__text__table">
                    <tbody>
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
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }
        })}
      </section>
      <Swoosh1 swooshColor="beige" backColor="cream" />
    </>
  );
}
