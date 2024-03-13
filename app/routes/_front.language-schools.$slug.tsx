import { Link, useLoaderData } from "@remix-run/react";
import {
  type LinksFunction,
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import { FaArrowRightLong } from "react-icons/fa6";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv, getTitle } from "~/common/utils";
import { HeadingOne } from "~/components/headings";
import { SimpleImageGallery } from "~/components/galleries";
import galleryStyles from "~/styles/components/galleries.css";
import { Swoosh1 } from "~/components/swooshes";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: galleryStyles },
];

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
        <div className="g-narrow-container">
          <HeadingOne
            enText="Introduction"
            jpText="学校紹介"
            align="center"
            bkground="light"
            level="h2"
          />
          <div dangerouslySetInnerHTML={{ __html: page.display_intro }} />
          <div className="ls-dp-intro__links">
            <Link to="/contact">
              無料体験レッスン <FaArrowRightLong />
            </Link>
            <Link to="/courses">コース一覧</Link>
            <Link to="/language-schools">スクール一覧</Link>
          </div>
        </div>
      </section>
      <section id="access">
        <div className="g-narrow-container">
          <HeadingOne
            enText="Access"
            jpText="アクセス"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        <div
          className="ls-dp-access__map"
          dangerouslySetInnerHTML={{ __html: page.display_map }}
        />
        <div className="g-basic-container">
          <div className="ls-dp-access__contact">
            <p>
              〒{ad.code} {ad.state}
              {ad.city}
              {ad.line_two}
              {ad.line_one}
            </p>
            <p>TEL：0561-42-5707</p>
            <p>
              メールアドレス：
              <Link to="mailto:contact@xlingual.co.jp">
                contact@xlingual.co.jp
              </Link>
            </p>
          </div>
          <div className="ls-dp-access__directions">
            <p>[ 電車でお越しの方 ] {page.access_train} </p>
            <p>[ お車でお越しの方 ] {page.access_car} </p>
          </div>
        </div>
      </section>

      <section id="gallery">
        <div className="g-narrow-container">
          <HeadingOne
            enText="Gallery"
            jpText="ギャラリー"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        <SimpleImageGallery
          images={page.ls_photos}
          baseUrl={ENV.BASE_BACK_URL}
        />
      </section>
      <Swoosh1 swooshColor="beige" backColor="cream" />
    </>
  );
}
