import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import homeStyles from "../styles/home.css";
import { getTitle } from "~/common/utils";

// server side functions
export const meta: V2_MetaFunction = () => {
  return [{ title: getTitle({ title: "", isHome: true }) }];
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
      <section id="video-banner">
        <div className="vbanner__wrapper">
          <video className="vbanner__video" playsInline autoPlay muted loop>
            <source src="/video/dummy.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="vbanner__promo">
          <div className="vbanner__text">
            <h2 className="vbanner__title">
              Learn English with our{" "}
              <span className="vbanner__yellow">multi</span>
              <span className="vbanner__red">lingual</span> expert teachers.
            </h2>
          </div>
          <div className="vbanner__buttons">
            <button className="button ">Courses</button>
            <button className="button button--orange">Experiences</button>
          </div>
        </div>
      </section>

      <section id="why">
        <hgroup className="bsection-group why__heading">
          <h2 className="bsection-group__heading">Why learn with us?</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
        <div className="why__wrapper">
          <div className="why-point"></div>
          <div className="why-point"></div>
          <div className="why-point"></div>
        </div>
      </section>

      <section id="popular">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Most popular courses</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
      </section>

      <section id="voice">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Student voice</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
      </section>

      <section id="experiences">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Meet us in an experience</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
      </section>

      <section id="free">
        <hgroup className="bsection-group">
          <h2 className="bsection-group__heading">Learn for free</h2>
          <p className="bsection-group__subheading">
            占由の季及投先ぼがゆも奇引りン
          </p>
        </hgroup>
      </section>

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
          <h3>リッスト</h3>
          <ul>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
          </ul>
          <h3>リッスト</h3>
          <ol>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
            <li>者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季</li>
          </ol>
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
        <p>Some stuff</p>
      </footer>
    </>
  );
}
