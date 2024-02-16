import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { SlidingHeaderPage } from "~/components/pages";
import { FaArrowDown } from "react-icons/fa6";
/**
 *  Utils and helper functions
 */
const contactMenu = [
  {
    id: 1,
    text: "無料体験レッスン",
    url: "#trial",
  },
  {
    id: 2,
    text: "ランゲージ・エクスペリエンス",
    url: "#experience",
  },
  {
    id: 3,
    text: "よくある質問",
    url: "#qanda",
  },
  {
    id: 4,
    text: "お電話でのお問い合わせ",
    url: "#telephone",
  },
  {
    id: 5,
    text: "お問い合わせフォーム",
    url: "#form",
  },
];

/**
 * Server functions
 */
export async function loader() {
  try {
    const apiUrl = `${BASE_API_URL}/pages/?slug=contact&type=contacts.ContactPage&fields=*`;
    const response = await fetch(apiUrl);
    const contactPageData = await response.json();
    if (!response.ok || !contactPageData.items.length) {
      throw new Response("Sorry, that is a 404", { status: 404 });
    }
    const page = contactPageData.items[0];
    return json({ page });
  } catch (error) {
    throw new Response("Oh sorry, that is a 500", { status: 500 });
  }
} // loader

export default function ContactIndexPage() {
  const ENV = getGlobalEnv();
  const { page } = useLoaderData<typeof loader>();
  return (
    <SlidingHeaderPage
      mainTitle={page.title}
      subTitle={page.display_title}
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <div className="ct-nav">
        {contactMenu.map((item) => {
          return <PageNav key={item.id} text={item.text} url={item.url} />;
        })}
      </div>
    </SlidingHeaderPage>
  );
}

/*
 * Components
 */

type TPageNavProps = {
  text: string;
  url: string;
};

function PageNav({ text, url }: TPageNavProps) {
  return (
    <Link className="ct-nav__link " to={url}>
      <div className="ct-nav__btn">
        <div className="ct-nav__icon">
          <FaArrowDown />
        </div>
        <div className="ct-nav__text">{text}</div>
      </div>
    </Link>
  );
}
