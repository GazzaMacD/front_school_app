import { Link, useLoaderData } from "@remix-run/react";
import {
  type LinksFunction,
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { BlogCard } from "~/components/cards";
import { StaffRoundPicCard } from "~/components/cards";
import { Swoosh1 } from "~/components/swooshes";
import { SimpleImageGallery } from "~/components/galleries";
import galleryStyles from "~/styles/components/galleries.css";
import {
  getDateStringWithDays,
  getDivisor4LetterHash,
  getGlobalEnv,
} from "~/common/utils";
import {
  FaRegCalendar,
  FaRegHandPointRight,
  FaYenSign,
  FaRegClock,
  FaInfo,
} from "react-icons/fa6";
import { HeadingOne } from "~/components/headings";
import cardStyles from "~/styles/components/cards.css";
import { getTitle } from "~/common/utils";

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
  { rel: "stylesheet", href: galleryStyles },
];

export const meta: V2_MetaFunction = ({ data }) => {
  const { page } = data;
  return [
    { title: getTitle({ title: `${page.display_title}`, isHome: false }) },
  ];
};

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

      <section id="past-photos">
        <div className="g-narrow-container">
          <HeadingOne
            enText="Past Pictures"
            jpText="過去の写真"
            align="center"
            bkground="light"
            level="h2"
          />
        </div>
        <SimpleImageGallery
          images={page.past_photos}
          baseUrl={ENV.BASE_BACK_URL}
        />
      </section>

      <section id="details">
        <div className="g-narrow-container">
          <HeadingOne
            enText="Experience Details"
            jpText="エクスペリエンスの詳細"
            align="center"
            bkground="light"
            level="h2"
          />
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
                  <h4>スケジュール</h4>
                  {block.value.intro && <p>{block.value.intro}</p>}
                  <table className="le-dp-details__schedule-table">
                    <thead>
                      {hasDate ? (
                        <tr>
                          <th className="date">
                            <span>
                              <FaRegCalendar /> Date
                            </span>
                          </th>
                          <th className="time">
                            <span>
                              <FaRegClock /> Time
                            </span>
                          </th>
                          <th className="info">
                            <span>
                              <FaInfo /> Information
                            </span>
                          </th>
                        </tr>
                      ) : (
                        <tr>
                          <th className="time">
                            <FaRegClock /> Time
                          </th>
                          <th className="info">
                            <FaInfo /> Information
                          </th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {block.value.schedule.map((row) => {
                        return (
                          <tr key={row.detail.slice(0, 12)}>
                            {hasDate && <td className="date">{row?.date}</td>}
                            <td className="time">{row.time.slice(0, 5)}</td>
                            <td className="info">{row.detail}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
          })}
          <div className="le-dp-details__prices">
            <h4>料金</h4>
            <table className="le-dp-details__price-table">
              <thead>
                <tr>
                  <th className="choice">
                    <span>
                      <FaRegHandPointRight /> Option
                    </span>
                  </th>
                  <th className="price">
                    <span>
                      <FaYenSign /> Price
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getValidPrices(
                  page.learning_experience.product_service.prices
                ).map((price) => {
                  return (
                    <tr key={price.id}>
                      <td>{price.display_name}</td>
                      <td>
                        ￥{price.posttax_price} <span>(税込)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <ul></ul>
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
          className="le-dp-access__map"
          dangerouslySetInnerHTML={{ __html: page.display_map }}
        />
        {page.address && (
          <div className="g-basic-container">
            <div className="le-dp-access__contact">
              <p>
                {page.address.postal_code} {page.address.city_town_village}{" "}
                {page.address.line_two} {page.address.line_one}{" "}
                {page.address.name}
              </p>
              <p>TEL: 0561-42-5707</p>
              <p>
                メールアドレス:{" "}
                <a href="mailto:contact@xlingual.co.jp">
                  contact@xlingual.co.jp
                </a>
              </p>
            </div>
          </div>
        )}
      </section>

      <section id="related-lessons">
        <div className="g-grid-container1">
          <div className="le-dp-related__heading">
            <h2>あなたへのおすすめ記事</h2>
          </div>
          {page.related_lessons.map((item, i) => {
            const lesson = item.lesson;
            return (
              <BlogCard
                i={`item${i}`}
                key={lesson.id}
                slug={lesson.slug}
                src={`${ENV.BASE_BACK_URL}/${lesson.image.thumbnail.src}`}
                alt={lesson.image.thumbnail.alt}
                date={lesson.published_date}
                title={lesson.display_title}
                category={lesson.category}
              />
            );
          })}
        </div>
      </section>
      <Swoosh1 swooshColor="beige" backColor="white" />
    </>
  );
}
