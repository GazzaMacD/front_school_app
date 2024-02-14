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
  return (
    <div className="st">
      <div className="g-narrow-container">
        <header>
          <div className="st-header__img-wrapper">
            <img
              src={`${ENV.BASE_BACK_URL}${data.profile_image.original.src}`}
              alt={`${data.profile_image.original.alt}`}
            />
          </div>
          <h1 className="st-header__name">{data.title}</h1>
        </header>
        <div className="st-summary">
          <table>
            <tbody>
              <tr>
                <td>出身国</td>
                <td>{data.country}</td>
              </tr>
              <tr>
                <td>母国語</td>
                <td>{data.native_language.name_ja}</td>
              </tr>
              <tr>
                <td>その他の言語</td>
                <td>
                  {data.languages_spoken
                    .map((l) => l.language.name_ja)
                    .join("、")}
                </td>
              </tr>
              <tr>
                <td>趣味</td>
                <td>{data.hobbies}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="st-interview">
          {data.interview.map((block) => {
            if (block.type === "q_and_a") {
              return block.value.q_and_a_series.map((qa) => {
                return (
                  <div key={qa.question} className="st-interview__qa">
                    <p>{qa.question}</p>
                    <p>{qa.answer}</p>
                  </div>
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
    </div>
  );
}
