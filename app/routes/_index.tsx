import type { V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import homeStyles from "../styles/home.css";

// server side functions
export const meta: V2_MetaFunction = () => {
  return [{ title: "英会話・語学学校 エクスリンガル" }];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles },
];

export const loader = async () => {
  // fetch page data from django wagtail backend here
  return json({
    text: "転理セリム座都ヲムニ横重ヤキ難家訪め平占由の季及投先ぼがゆも奇引りン員新ク大冤冶凋凌へぴイ。因クう首手代9意みの覧詞イいて走明コウキ視9皇辞ワ索毎フ悪部表ワス録浩ツ助頼柔ゅばル。由ちぐめ号好げず編風6横アタ残相げ橋稿モイカ床奉へで法区ク選公クで決30共るちス溶雄類仇佗ぽてこえ。 者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季21勤キシ名2破ンむ未",
  });
};

// --------------------------------//
// client side functions
export default function Index() {
  const { text } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="fullwidth-video">
        <video className="video" playsInline autoPlay muted loop>
          <source src="/video/dummy.mp4" type="video/mp4" />
        </video>
        <div className="overlay">
          <div className="vinner">
            <div className="vbanner">
              <h2>
                <span className="green-text">
                  Awesome lessons and <span className="yellow-text">lear</span>
                  <span className="red-text">ning</span> experiences
                </span>
              </h2>
              <div className="vbanner__buttons">
                <button className="button button--red ">Button</button>
                <button className="button button--yellow">Button</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="temp-video-base"></div>
      <section className="bgrid">
        <div className="btext">
          <h1>誕険かやあそ障子生ヌコ社数ルモ</h1>
          <p>{text}</p>
          <h2>誕険かやあそ障子生ヌコ社数ルモ</h2>
          <p>{text}</p>
          <h3>誕険かやあそ障子生ヌコ社数ルモ</h3>
          <p>
            転理セリム座都
            <a href="https://google.com">ヲムニ横重ヤキ難家訪め平</a>
            占由の季及投先ぼがゆも奇引りン員新ク大冤冶凋凌へぴイ。因クう首手代9意みの覧詞イいて走明コウキ視9皇辞ワ索毎フ悪部表ワス録浩ツ助頼柔ゅばル。由ちぐめ号好げず編風6横アタ残相げ橋稿モイカ床奉へで法区ク選公クで決30共るちス溶雄類仇佗ぽてこえ。
            者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季21勤キシ名2破ンむ未
          </p>
          <h4>誕険かやあそ障子生ヌコ社数ルモ</h4>
          <p>{text}</p>
          <button className="button">Basic Button</button>
        </div>
        <figure className="full-image">
          <img src="/img/class.jpg" alt="Students" />
          <figcaption>Students</figcaption>
        </figure>
        <div className="btext">
          <h2 className="en">Section</h2>
          <p>{text}</p>
        </div>
        <div className="btext">
          <h2 className="en">Section</h2>
          <p>{text}</p>
        </div>
        <figure className="text-width-image">
          <img src="/img/class.jpg" alt="Students" />
          <figcaption>Students</figcaption>
        </figure>
        <div className="btext">
          <h2 className="en">Section</h2>
          <p>{text}</p>
        </div>
        <figure className="three-quarter-image">
          <img src="/img/class.jpg" alt="Students" />
          <figcaption>Students</figcaption>
        </figure>
        <div className="btext">
          <h2 className="en">Section</h2>
          <p>{text}</p>
        </div>
      </section>
      <footer className="bfooter">
        <h2>Footer here</h2>
      </footer>
    </>
  );
}
