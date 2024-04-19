import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { BASE_API_URL } from "~/common/constants.server";
import { useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";
import React from "react";

/* types */

/* server side functions */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { slug } = params;
  const apiUrl = `${BASE_API_URL}/pages/?type=staff.StaffDetailPage&slug=${slug}&fields=*`;
  console.log(apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (!response.ok || !data.items.length) {
    throw new Response("Sorry, that's a 404", { status: 404 });
  }
  const page = data.items[0];
  return json({ page });
}

/* page components */
export default function StaffDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  return (
    <div className="st">
      <div className="g-narrow-container">
        <header>
          <div className="st-header__img-wrapper">
            <img
              src={`${ENV.BASE_BACK_URL}${page.profile_image.original.src}`}
              alt={`${page.profile_image.original.alt}`}
            />
          </div>
          <h1 className="st-header__name">{page.title}</h1>
        </header>
        <div className="st-summary">
          <table>
            <tbody>
              <tr>
                <td>出身国</td>
                <td>{page.country}</td>
              </tr>
              <tr>
                <td>母国語</td>
                <td>{page.native_language.name_ja}</td>
              </tr>
              <tr>
                <td>その他の言語</td>
                <td>
                  {page.languages_spoken
                    .map((l) => l.language.name_ja)
                    .join("、")}
                </td>
              </tr>
              <tr>
                <td>趣味</td>
                <td>{page.hobbies}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="st-interview">
          {page.interview.map((block) => {
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
