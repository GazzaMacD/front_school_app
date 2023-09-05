import { json, type LoaderArgs } from "@remix-run/node";
import { BASE_API_URL } from "~/common/constants.server";
import { useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";
import React from "react";

/* types */

/* server side functions */
export async function loader({ request, params }: LoaderArgs) {
  try {
    const { slug } = params;
    const apiUrl = `${BASE_API_URL}/pages/?type=staff.StaffDetailPage&slug=${slug}&fields=*`;
    const response = await fetch(apiUrl);
    const responseData = await response.json();
    const data = responseData.items[0];
    if (!response.ok || !data) {
      return json(
        { data: null, error: { message: "Sorry, that is a 404." } },
        { status: 404 }
      );
    }
    return json({ data: data, error: null });
  } catch (error) {
    return json(
      { data: null, error: { message: "Sorry, that is a 500." } },
      { status: 500 }
    );
  }
}

/* page components */
export default function StaffDetailPage() {
  const { data, error } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  let ui = (
    <div>
      <h1>Sorry there is an error. Try again later.</h1>
    </div>
  );
  if (error) {
    ui = (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
    return ui;
  } else if (data) {
    ui = (
      <div>
        <h1>{data.title}</h1>
        <img
          src={`${ENV.BASE_BACK_URL}${data.profile_image.original.src}`}
          alt={`${data.profile_image.original.alt}`}
        />
        <p>{data.role}</p>
        <p>{data.country}</p>
        <p>{data.native_language.name_ja}</p>
        <ul>
          {data.languages_spoken.map((language) => {
            return <li key={language.id}>{language.language.name_ja}</li>;
          })}
        </ul>
        <p>{data.hobbies}</p>
        <div>
          {data.interview.map((block) => {
            if (block.type === "q_and_a") {
              return block.value.q_and_a_series.map((qa) => {
                return (
                  <React.Fragment key={qa.question}>
                    <p>{qa.question}</p>
                    <p>{qa.answer}</p>
                  </React.Fragment>
                );
              });
            } else if (block.type === "youtube") {
              return (
                <div key={block.id}>
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
            }
          })}
        </div>
      </div>
    );
    return ui;
  } else {
    return ui;
  }
}
