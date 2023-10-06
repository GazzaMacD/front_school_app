import type { LinksFunction } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import React from "react";
import { json } from "@remix-run/node";
import { getGlobalEnv } from "~/common/utils";

import contactStyles from "~/styles/contact.css";
import { BASE_API_URL } from "~/common/constants.server";

/* Types */

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contactStyles },
];

export async function loader() {
  try {
    const apiUrl = `${BASE_API_URL}/pages/?slug=contact&type=contacts.ContactPage&fields=*`;
    const response = await fetch(apiUrl);
    const contactPageData = await response.json();
    if (!response.ok || !contactPageData.items.length) {
      throw new Response("Sorry, that is a 404", { status: 404 });
    }
    const data = contactPageData.items[0];
    return json({ data });
  } catch (error) {
    throw new Response("Oh sorry, that is a 500", { status: 500 });
  }
} // loader

export default function ContactParentPage() {
  const ENV = getGlobalEnv();
  const { data } = useLoaderData<typeof loader>();

  return (
    <div id="trial">
      <header className="container">
        <h1 className="heading cf__title">{data.ja_title}</h1>
        <p>{data.short_intro}</p>
      </header>
      <section className="container" id="experience">
        <div>
          <Accordion
            ariaControls="trial-lesson-process"
            controllerElement={(isExpanded) => (
              <h2 className="cp__accordian-heading">
                <button>
                  Our trial lesson process
                  <span>{isExpanded ? "▲" : "▼"}</span>
                </button>
              </h2>
            )}
          >
            <div className="cp__accordian-content">
              {data.assessment_trial.map((block) => {
                if (block.type === "rich_text") {
                  return (
                    <div
                      key={block.id}
                      dangerouslySetInnerHTML={{ __html: block.value }}
                      className="cp__textinfo"
                    />
                  );
                }
                if (block.type === "info_cards") {
                  return (
                    <div className="blk-infocards" key={block.id}>
                      {block.value.cards.map((card) => {
                        return (
                          <div className="blk-infocard" key={card.title}>
                            <img
                              src={`${ENV.BASE_BACK_URL}${card.image.medium.src}`}
                              alt={card.image.medium.alt}
                              className="blk-infocard__img"
                            />
                            <div
                              className="blk-infocard__details"
                              key={card.title}
                            >
                              <h3 className="blk-infocard__title">
                                {card.title}
                              </h3>
                              <p className="blk-infocard__text">{card.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              })}
            </div>
          </Accordion>
        </div>
      </section>
      <section className="container">
        <div>
          <Accordion
            ariaControls="experience-process"
            controllerElement={(isExpanded) => (
              <h2 className="cp__accordian-heading">
                <button>
                  Join our experiences <span>{isExpanded ? "▲" : "▼"}</span>
                </button>
              </h2>
            )}
          >
            <div className="cp__accordian-content">
              {data.join_experience.map((block) => {
                if (block.type === "rich_text") {
                  return (
                    <div
                      key={block.id}
                      dangerouslySetInnerHTML={{ __html: block.value }}
                      className="cp__textinfo"
                    />
                  );
                }
                if (block.type === "info_cards") {
                  return (
                    <div className="blk-infocards" key={block.id}>
                      {block.value.cards.map((card) => {
                        return (
                          <div className="blk-infocard" key={card.title}>
                            <img
                              src={`${ENV.BASE_BACK_URL}${card.image.medium.src}`}
                              alt={card.image.medium.alt}
                              className="blk-infocard__img"
                            />
                            <div
                              className="blk-infocard__details"
                              key={card.title}
                            >
                              <h3 className="blk-infocard__title">
                                {card.title}
                              </h3>
                              <p className="blk-infocard__text">{card.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
              })}
            </div>
          </Accordion>
        </div>
      </section>
      <section id="contact" className="container">
        <Accordion
          ariaControls="experience-process"
          controllerElement={(isExpanded) => (
            <h2 className="cp__accordian-heading">
              <button>
                Common questions
                <span>{isExpanded ? "▲" : "▼"}</span>
              </button>
            </h2>
          )}
        >
          <div className="cp__accordian-content">
            {data.question_and_answer.map((block) => {
              if (block.type === "q_and_a") {
                return (
                  <div className="blk-q-and-a" key={block.id}>
                    {block.value.q_and_a_series.map((qa) => {
                      return (
                        <React.Fragment key={qa.question}>
                          <p>{qa.question}</p>
                          <p>{qa.answer}</p>
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              }
            })}
          </div>
        </Accordion>
      </section>
      <section className="container">
        <div className="cf-wrapper">
          <div className="cf-header">
            <h2 className="cf-title">Contact us</h2>
          </div>
          <div className="cf-main">
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
}

type TAccordianProps = {
  controllerElement: React.FunctionComponent;
  ariaControls: string;
  children: React.ReactNode;
};

const Accordion = ({
  controllerElement,
  ariaControls,
  children,
}: TAccordianProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <div
        aria-expanded={isExpanded}
        aria-controls={ariaControls}
        onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
      >
        {controllerElement(isExpanded)}
      </div>
      {
        <div
          className={`${isExpanded ? "accordian__open" : "accordian__closed"}`}
          id={ariaControls}
        >
          {children}
        </div>
      }
    </>
  );
};
