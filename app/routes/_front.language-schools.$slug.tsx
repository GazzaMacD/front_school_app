import { Link, useLoaderData } from "@remix-run/react";
import {
  type LinksFunction,
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv, getTitle } from "~/common/utils";

export const meta: V2_MetaFunction = ({ data }) => {
  const { page } = data;
  return [
    { title: getTitle({ title: `${page.display_title}`, isHome: false }) },
  ];
};

export async function loader({ params }: LoaderArgs) {
  try {
    const { slug } = params;
    const dPageUrl = `${BASE_API_URL}/pages/?slug=${slug}&type=languageschools.LanguageSchoolDetailPage&fields=*`;
    const res = await fetch(dPageUrl);
    const dPagepage = await res.json();
    if (!res.ok || !dPagepage.items.length) {
      throw new Response(`Oops that is a ${res.status}`, {
        status: res.status,
      });
    }
    const page = dPagepage.items[0];
    return json({ page });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function LanguageSchoolDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const ad = page.ls.address;
  return (
    <>
      <header className="ls-dp-header">
        <div className="g-basic-container">
          <div className="ls-dp-header__titles">
            <h1>
              {page.display_title}校<span>{page.title} school</span>
            </h1>
          </div>
        </div>
        <div className="ls-dp-header__img-wrap">
          <img
            src={`${ENV.BASE_BACK_URL}${page.header_image.original.src}`}
            alt={page.header_image.original.alt}
          />
        </div>
      </header>

      <section id="intro">
        <h2>Introduction</h2>
        <h4>学校の紹介</h4>
        <div dangerouslySetInnerHTML={{ __html: page.display_intro }} />
        <Link to="/contact">無料体験レッスン</Link>
        <Link to="/courses">Our Courses</Link>
        <Link to="/language-schools">See more schools</Link>
      </section>

      <section id="access">
        <h2>Location and Access</h2>
        <h4>場所とアクセス</h4>
        <div dangerouslySetInnerHTML={{ __html: page.display_map }} />
        <div>
          <h5>Address</h5>
          <p>{ad.code}</p>
          <p>{ad.country}</p>
          <p>{ad.state}</p>
          <p>{ad.city}</p>
          {ad.line_two && <p>{ad.line_two}</p>}
          <p>{ad.line_one}</p>
        </div>
        <div>
          <h5>Access</h5>
          <p>{page.access_info}</p>
        </div>
      </section>

      <section>
        <h2>Photos of our School</h2>
        <h4>学校の写真</h4>
        <div>
          {page.ls_photos.map((block) => {
            if (block.type === "simple_image_block") {
              return (
                <figure key={block.id}>
                  <img
                    src={`${ENV.BASE_BACK_URL}${block.value.image.medium.src}`}
                    alt={block.value.image.medium.alt}
                  />
                  <figcaption>{block.value.caption}</figcaption>
                </figure>
              );
            }
          })}
        </div>
      </section>
    </>
  );
}
