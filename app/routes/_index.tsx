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
    text: "4慣ヨヱソ転理セリム座都ヲムニ横重ヤキ難家訪め平占由の季及投先ぼがゆも奇引りン員新ク大冤冶凋凌へぴイ。因クう首手代9意みの覧詞イいて走明コウキ視9皇辞ワ索毎フ悪部表ワス録浩ツ助頼柔ゅばル。由ちぐめ号好げず編風6横アタ残相げ橋稿モイカ床奉へで法区ク選公クで決30共るちス溶雄類仇佗ぽてこえ。 者ヘキヨケ田治フ聖鋭セレ生声意断ヌヤワユ季21勤キシ名2破ンむ未聞写ス往回フクヒホ循50混ンろ上張おや志力久座員ど。1末うがいけ刊参組エヱヨ地生ユツコシ亮科く占辛おはて歓業こ売五びざゅ誕険かやあそ障子生ヌコ社数ルモ傳正天ぼ方茨さぱ成加ッせやか掲面にじがを原佐と気全ょねゆろ表元慈抹沙なッまお。my text",
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
      <div className="fullwidth">
        <div className="text-container">
          <h1 className="heading en">Welcome to the new Xlingual App</h1>
          <p>{text}</p>
          <button className="button button--red">Basic Button</button>
        </div>
      </div>
      <div className="fullwidth green">
        <div className="text-container">
          <h2>末うがいけ刊参組エヱヨ地生ユツコシ亮科</h2>
          <p>{text}</p>
        </div>
      </div>
      <div className="fullwidth">
        <div className="text-container">
          <h3>末うがいけ刊参組エヱヨ地生ユツコシ亮科</h3>
          <ul>
            <li>皇辞ワ索毎フ悪部表ノワス録浩ツ助頼柔ゅばル。</li>
            <li>皇辞ワ索毎フ悪部表ノワス録浩ツ助頼柔ゅばル。</li>
            <li>皇辞ワ索毎フ悪部表ノワス録浩ツ助頼柔ゅばル。</li>
            <li>皇辞ワ索毎フ悪部表ノワス録浩ツ助頼柔ゅばル。</li>
            <li>皇辞ワ索毎フ悪部表ノワス録浩ツ助頼柔ゅばル。</li>
            <li>皇辞ワ索毎フ悪部表ノワス録浩ツ助頼柔ゅばル。</li>
          </ul>
        </div>
      </div>
      <div className="fullwidth dark">
        <div className="text-container">
          <h2 className="en">This is English</h2>
          <h2>末うがいけ刊参組エヱヨ地生ユツコシ亮科</h2>
          <p>{text}</p>
        </div>
      </div>
      <div className="fullwidth cream-gradient">
        <div className="text-container">
          <h2 className="en">This is cream gradient</h2>
          <h2>末うがいけ刊参組エヱヨ地生ユツコシ亮科</h2>
          <p>{text}</p>
        </div>
      </div>
      <div className="fullwidth green-gradient">
        <div className="text-container">
          <h2 className="en">This is a green gradient</h2>
          <h2>末うがいけ刊参組エヱヨ地生ユツコシ亮科</h2>
          <p>{text}</p>
        </div>
      </div>
      <div className="fullwidth">
        <div className="text-container">
          <h2 className="en">This is English</h2>
          <h2>末うがいけ刊参組エヱヨ地生ユツコシ亮科</h2>
          <p>{text}</p>
        </div>
      </div>
      <div className="fullwidth green">
        <div className="text-container">
          <h2 className="en">This is English</h2>
          <h2>末うがいけ刊参組エヱヨ地生ユツコシ亮科</h2>
          <p>{text}</p>
        </div>
      </div>
    </>
  );
}
