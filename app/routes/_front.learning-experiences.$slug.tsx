import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json, LoaderArgs } from "@remix-run/node";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineInfo,
} from "react-icons/ai";

import { BASE_API_URL } from "~/common/constants.server";
import { getDateString, getGlobalEnv } from "~/common/utils";

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;
  try {
    const url = `${BASE_API_URL}/pages/?slug=${slug}&type=products.LearningExperienceDetailPage&fields=*`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !data.items.length) {
      throw new Response("Sorry, 404", { status: 404 });
    }
    const page = data.items[0];
    return json({ page });
  } catch (error) {
    //console.log(error);
    throw new Response("oops that is an error", { status: 500 });
  }
}

export default function LearningExperiencesDetailPage() {
  const { page } = useLoaderData<typeof loader>();
  const ENV = getGlobalEnv();
  const dateString = getDateString(page.start_date, page.end_date);
  return (
    <div id="lexdp">
      <header>
        <hgroup className="lexdp__heading">
          <h1>
            <span>Learning Experience</span>
            {page.display_title}
          </h1>
          <p>{page.display_tagline}</p>
        </hgroup>
        <img
          src={`${ENV.BASE_BACK_URL}${page.header_image.original.src}`}
          alt={page.header_image.original.alt}
          className="lexdp__top-img"
        />
      </header>
      <section id="lexdp-will-do">
        <hgroup className="lexdp__heading">
          <h2>
            <span>What will we do?</span>
            どうするんだろう？
          </h2>
          <p>
            どのようなエキサイティングなアクティビティや学習に参加できるかをご覧ください。
          </p>
        </hgroup>
        <div
          className="text-container"
          dangerouslySetInnerHTML={{ __html: page.will_do }}
        />
      </section>
      <section id="lexdp-who">
        <hgroup className="lexdp__heading">
          <h2>
            <span>Who are your teachers?</span>
            先生とは？
          </h2>
          <p>
            この体験に参加する素晴らしいバイリンガルまたはマルチリンガルの先生たちは、あなたを指導し、より良い英語スピーカーになるための手助けをしてくれます
          </p>
        </hgroup>
        <div className="container">
          {page.staff_members.map((sm) => {
            return (
              <article key={sm.id} className="lexdp__staff-card">
                <img
                  src={`${ENV.BASE_BACK_URL}${sm.staff.image.thumbnail.src}`}
                  alt={sm.staff.image.thumbnail.alt}
                />
                <h3>{sm.staff.name}</h3>
                <Link to={`/staff/${sm.staff.slug}`}>Learn more...</Link>
              </article>
            );
          })}
        </div>
      </section>
      <section id="lexdp-pics">
        <hgroup className="lexdp__heading">
          <h2>
            <span>Past pictures</span>
            過去の写真
          </h2>
          <p>過去の学習体験の写真を見てみよう</p>
        </hgroup>
        <div className="lexdp__past-pictures">
          {page.past_photos.map((p) => {
            return (
              <figure key={p.id}>
                <img
                  src={`${ENV.BASE_BACK_URL}${p.value.image.medium.src}`}
                  alt={p.value.image.medium.src}
                />
                {p.value.caption && <figcaption>{p.value.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
      </section>
      <section id="lexdp-details">
        <hgroup className="lexdp__heading">
          <h2>
            <span>Experience details</span>
            エクスペリエンスの詳細
          </h2>
          <p>時間、スケジュール、料金、その他の情報はこちらから</p>
        </hgroup>
        <div className="lexdp__details text-container">
          {page.details.map((block) => {
            if (block.type === "limited_rich_text_block") {
              return (
                <div
                  key={block.id}
                  dangerouslySetInnerHTML={{ __html: block.value }}
                />
              );
            }
            if (block.type === "schedule_block") {
              const hasDate: boolean = block.value.schedule.some(
                (item) => item.date
              );
              return (
                <div key={block.id}>
                  <h3>{block.value.title}</h3>
                  {block.value.intro && <p>{block.value.intro}</p>}
                  <table className="lexdp__schedule-table">
                    {hasDate ? (
                      <tr>
                        <th>
                          <span>
                            <AiOutlineCalendar /> Date
                          </span>
                        </th>
                        <th>
                          <span>
                            <AiOutlineClockCircle /> Time
                          </span>
                        </th>
                        <th>
                          <span>
                            <AiOutlineInfo /> Information
                          </span>
                        </th>
                      </tr>
                    ) : (
                      <tr>
                        <th>
                          <AiOutlineClockCircle /> Time
                        </th>
                        <th>
                          <AiOutlineInfo /> Information
                        </th>
                      </tr>
                    )}
                    {block.value.schedule.map((row) => {
                      return (
                        <tr key={row.detail.slice(0, 12)}>
                          {hasDate && <td>{row.date}</td>}
                          <td>{row.time.slice(0, 5)}</td>
                          <td>{row.detail}</td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              );
            }
          })}
        </div>
      </section>
      <section id="lexdp-place">
        <hgroup className="lexdp__heading">
          <h2>
            <span>Where are we going to be?</span>
            どこにあるのか？
          </h2>
          <p>体験の開催場所を示す地図と、必要であれば住所</p>
        </hgroup>
        <div
          className="lexdp__map"
          dangerouslySetInnerHTML={{ __html: page.display_map }}
        />
        {page.address && (
          <div className="text-container">
            <h3>Address</h3>
            <p>{page.address.postalCode}</p>
            <p>{page.address.cityTownVillage}</p>
            <p>{page.address.lineTwo}</p>
            <p>{page.address.lineOne}</p>
            <p>{page.address.name}</p>
          </div>
        )}
      </section>
      <section id="lexdp-lessons">
        <hgroup className="lexdp__heading">
          <h2>
            <span>Free lessons to help you</span>
            お役に立てるような無料ブログレッスン？
          </h2>
          <p>
            これらのブログレッスンは、あなたがネイティブのように話すのを助けるために設計されており、この経験はあなたの助けになるでしょう。
          </p>
        </hgroup>
        <div className="lexdp__lessons">
          {page.related_lessons.map((item) => {
            const lesson = item.lesson;
            return (
              <div key={lesson.id} className="lexdp__lesson">
                <img
                  src={`${ENV.BASE_BACK_URL}${lesson.image.thumbnail.src}`}
                  alt={lesson.image.thumbnail?.alt}
                />
                <div className="lexdp__lesson-details">
                  <h4>{lesson.ja_title}</h4>
                  <p>{lesson.short_intro}</p>
                  <Link to={`/lessons/${lesson.slug}`}>Learn More</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const temp = {
  staff_members: [
    {
      id: 1,
      meta: {
        type: "products.ExperiencePageStaff",
      },
      staff: {
        id: 8,
        name: "Brian Carpenter",
        slug: "brian-carpenter",
        position: "CEO",
        intro:
          "枝井取改ー際細ナラク間内ヱ真値あっど編参あを慎八すッ文右7成いっドふ針97念テ別声かでりっ選何き獲浅べを月姫校ねやこゅ。猶ユチオア教視成な再日ハキヌオ碁不ー教表さにっ声行けりちら断命楽れさ転属ツ更座レ投記ホニ際質ワ芸場テシケク美庁課囲ゃ。囲ツスコ表道ヤ描村ツテ再7中楽ょせ古戻スなげ遺愛フルヘ示償ほじ渉者次まえ採場シ頭24没ウ風41尚徒阿忘ねドる。",
        image: {
          id: 7,
          title: "Brian Carpenter",
          original: {
            src: "/media/images/portrait_image_pwCwxFV.original.jpg",
            width: 1080,
            height: 1080,
            alt: "Brian Carpenter",
          },
          thumbnail: {
            src: "/media/images/portrait_image_pwCwxFV.2e16d0ba.fill-450x450.jpg",
            width: 450,
            height: 450,
            alt: "Brian Carpenter",
          },
        },
      },
    },
  ],
};
