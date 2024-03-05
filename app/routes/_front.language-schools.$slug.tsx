import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json, type LoaderArgs } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";

export async function loader({ params }: LoaderArgs) {
  try {
    const { slug } = params;
    const dPageUrl = `${BASE_API_URL}/pages/?slug=${slug}&type=languageschools.LanguageSchoolDetailPage&fields=*`;
    const res = await fetch(dPageUrl);
    const dPageData = await res.json();
    if (!res.ok || !dPageData.items.length) {
      throw new Response(`Oops that is a ${res.status}`, {
        status: res.status,
      });
    }
    const data = dPageData.items[0];
    return json({ data });
  } catch (error) {
    console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function LanguageSchoolDetailPage() {
  const { data } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const ad = data.ls.address;
  return (
    <div className="ls-dp">
      <header>
        <h1>{data.title}</h1>
        <p>{data.display_title}</p>
        <img
          src={`${ENV.BASE_BACK_URL}${data.header_image.original.src}`}
          alt={data.header_image.original.alt}
        />
      </header>
      <section>
        <h2>Introduction</h2>
        <h4>学校の紹介</h4>
        <div dangerouslySetInnerHTML={{ __html: data.display_intro }} />
        <Link to="/contact">無料体験レッスン</Link>
        <Link to="/courses">Our Courses</Link>
        <Link to="/language-schools">See more schools</Link>
      </section>
      <section>
        <h2>Location and Access</h2>
        <h4>場所とアクセス</h4>
        <div dangerouslySetInnerHTML={{ __html: data.display_map }} />
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
          <p>{data.access_info}</p>
        </div>
      </section>
      <section>
        <h2>Photos of our School</h2>
        <h4>学校の写真</h4>
        <div>
          {data.ls_photos.map((block) => {
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
    </div>
  );
}
