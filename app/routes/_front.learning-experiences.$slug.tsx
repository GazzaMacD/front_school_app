import { Link, useLoaderData } from "@remix-run/react";
import { type LinksFunction, json, type LoaderArgs } from "@remix-run/node";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineInfo,
} from "react-icons/ai";

import { BASE_API_URL } from "~/common/constants.server";
import { StaffRoundPicCard } from "~/components/cards";
import {
  getDateStringWithDays,
  getDivisor4LetterHash,
  getGlobalEnv,
} from "~/common/utils";
import { FaRegCalendar } from "react-icons/fa6";
import { HeadingOne } from "~/components/headings";
import cardStyles from "~/styles/components/cards.css";

function getValidPrices(prices) {
  const now = new Date().getTime();
  const validPrices = prices.filter((price) => {
    const startDate = new Date(price.start_date).getTime();
    const endDate = price.end_date ? new Date(price.end_date).getTime() : null;
    if (startDate > now) return false;
    if (endDate && endDate < now) return false;
    return true;
  });
  return validPrices;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: cardStyles },
];

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
  const dateString = getDateStringWithDays(page.start_date, page.end_date);
  const teacherHash = getDivisor4LetterHash(page.staff_members.length);

  return (
    <>
      <header className="le-dp-header">
        <div className="g-basic-container">
          <div className="le-dp-header__titles">
            <h1>
              {page.display_title}
              <span>{page.title}</span>
            </h1>
            <p>{page.display_tagline}</p>
            <div>
              <FaRegCalendar />
              {dateString}
            </div>
          </div>
        </div>
        <div>
          <img
            src={`${ENV.BASE_BACK_URL}${page.header_image.original.src}`}
            alt={page.header_image.original.alt}
            className="lexdp__top-img"
          />
        </div>
      </header>

      <section id="will-do">
        <div className="g-narrow-container">
          <HeadingOne
            enText="What will we do?"
            jpText="何をするか"
            align="center"
            bkground="light"
            level="h2"
          />
          <div
            className="text-container"
            dangerouslySetInnerHTML={{ __html: page.will_do }}
          />
        </div>
      </section>

      <section id="teachers">
        <div className="g-grid-container1">
          <div className="le-dp-teachers__heading">
            <HeadingOne
              enText="Who are your teachers?"
              jpText="担当の講師"
              align="center"
              bkground="light"
              level="h2"
            />
          </div>
          {page.staff_members.map((sm, i, arr) => {
            if (arr.length === 1) {
              return (
                <div className="le-dp-teachers__teacher-wrap" key={sm.id}>
                  <StaffRoundPicCard
                    url={`/staff/${sm.staff.slug}`}
                    src={`${ENV.BASE_BACK_URL}${sm.staff.image.thumbnail.src}`}
                    alt={sm.staff.image.thumbnail.alt}
                    name={sm.staff.name}
                    tagline={sm.staff.tagline}
                  />
                </div>
              );
            } else {
              return (
                <div
                  className={`le-dp-teachers__teacher-wrap ${teacherHash[i]} `}
                  key={sm.id}
                >
                  <StaffRoundPicCard
                    url={`/staff/${sm.staff.slug}`}
                    src={`${ENV.BASE_BACK_URL}${sm.staff.image.thumbnail.src}`}
                    alt={sm.staff.image.thumbnail.alt}
                    name={sm.staff.name}
                    tagline={sm.staff.tagline}
                  />
                </div>
              );
            }
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
                          {hasDate && <td>{row?.date}</td>}
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
          <h3>料金</h3>
          <ul>
            {getValidPrices(
              page.learning_experience.product_service.prices
            ).map((price) => {
              return (
                <li key={price.id}>
                  {price.display_name} - ￥{price.posttax_price}
                  <span> (税込)</span>
                </li>
              );
            })}
          </ul>
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
            <p>{page.address.postal_code}</p>
            <p>{page.address.city_town_village}</p>
            <p>{page.address.line_two}</p>
            <p>{page.address.line_one}</p>
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
    </>
  );
}
