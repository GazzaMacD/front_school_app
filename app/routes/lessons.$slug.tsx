import { redirect, json } from "@remix-run/node";
import { BASE_API_URL, BASE_BACK_URL } from "~/common/constants";
import { useLoaderData } from "@remix-run/react";
import { handlePreview } from "~/common/utils";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { useRouteError, isRouteErrorResponse, Link } from "@remix-run/react";

/*types */
import type { LoaderArgs } from "@remix-run/node";
import type {
  TWagBasicImage,
  TWagListAllBase,
  TBaseDetailPage,
} from "~/common/types";

type TLessonDetailOptions = {
  jp_title: string;
  published_date: string;
  header_image: TWagBasicImage;
};

type TLessonsPreview = TBaseDetailPage & {
  jp_title: string;
};

type TLesson = TListPageItemAllMeta & {
  jp_title: string;
};

type TLessons = TBaseListPage & {
  items: TLesson[];
};
/*
 * helper functions
 */

/*
 * Serverside functions
 */

export async function loader({ request, params }: LoaderArgs) {
  //handle previews
  const previewResponse = await handlePreview<TLessonsPreview>(request);
  if (previewResponse.isPreview && previewResponse.data) {
    return json({ data: previewResponse.data });
  }
  //NOTE : deal with preview errrors here
  try {
    const { slug } = params;
    if (!slug) {
      throw new Error("Error", { cause: 404 });
    }
    const apiUrl = `${BASE_API_URL}/pages/?type=lessons.LessonDetailPage&slug=${slug}&fields=*`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error", { cause: response.status });
    }
    const pagesData = await response.json();
    const data = pagesData.items[0];
    return json({ data: data });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      switch (error.cause) {
        case 404:
          throw new Response("Oops sorry something went wrong", {
            status: 404,
          });
        default:
          throw new Response("Oops sorry something went wrong", {
            status: 500,
          });
      }
    }
    throw new Response("Oops sorry something went wrong", { status: 500 });
  }
} //loader

/*
 * client side code
 */
export default function LessonsDetailPage() {
  const { data } = useLoaderData<typeof loader>();
  const pubDate = new Date(data.published_date);
  return (
    <>
      <div className="l-header">
        <header className="container">
          <div className="l-header__top">
            <Link
              to={`/lessons?category=${data.category.id}`}
              className="l-cat__link"
            >
              {data.category.ja_name}
            </Link>
            <div className="l-header__date">
              <AiOutlineCalendar />
              <p>
                {" "}
                {`${pubDate.getFullYear()}・${
                  pubDate.getMonth() + 1
                }・${pubDate.getDate()}`}
              </p>
            </div>
            <div className="l-header__learn">
              <AiOutlineClockCircle />
              <p>勉強時間: {data.estimated_time}分</p>
            </div>
          </div>
          <h1 className="l-header__title">{data.ja_title}</h1>
          <p className="l-header__intro">{data.short_intro}</p>
          <img
            className="l-detail-header__img"
            src={`${BASE_BACK_URL}${data.header_image.meta.download_url}`}
            alt={data.header_image.title}
          />
        </header>
      </div>
      <section>
        {data.lesson_content.map((block: any) => {
          if (block.type === "rich_text") {
            return (
              <div
                className="text-container"
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.value }}
              />
            );
          } else if (block.type === "text_width_img") {
            return (
              <div key={block.id} className="text-container">
                <figure>
                  <img
                    src={`${BASE_BACK_URL}${block.value.image.original.src}`}
                    alt={block.value.image.original?.alt}
                  />
                  {block.value?.caption ? (
                    <figcaption>{block.value.caption}</figcaption>
                  ) : null}
                </figure>
              </div>
            );
          } else if (block.type === "full_width_img") {
            return (
              <div key={block.id} className="full-width-container">
                <figure>
                  <img
                    src={`${BASE_BACK_URL}${block.value.image.original.src}`}
                    alt={block.value.image.original?.alt}
                  />
                  {block.value?.caption ? (
                    <figcaption>{block.value.caption}</figcaption>
                  ) : null}
                </figure>
              </div>
            );
          } else if (block.type === "beyond_text_img") {
            return (
              <div key={block.id} className="container">
                <figure>
                  <img
                    src={`${BASE_BACK_URL}${block.value.image.original.src}`}
                    alt={block.value.image.original?.alt}
                  />
                  {block.value?.caption ? (
                    <figcaption>{block.value.caption}</figcaption>
                  ) : null}
                </figure>
              </div>
            );
          } else if (block.type === "block_quote") {
            return (
              <div key={block.id} className="text-container">
                <figure className="bquote">
                  <div className="bquote__inner">
                    <blockquote cite={block.value?.citation_url}>
                      <p>{block.value.quote}</p>
                    </blockquote>
                    <figcaption>
                      — {block.value.author},{" "}
                      <cite>{block.value.citation_source}</cite>
                    </figcaption>
                  </div>
                </figure>
              </div>
            );
          }
        })}
      </section>
    </>
  );
}
