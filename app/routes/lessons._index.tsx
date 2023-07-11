import { redirect, json } from "@remix-run/node";
import { BASE_API_URL, BASE_BACK_URL } from "~/common/constants.server";
import { Link, useLoaderData } from "@remix-run/react";
import { handlePreview } from "~/common/utils";
import { useSearchParams } from "@remix-run/react";

/*types */
import type { LoaderArgs } from "@remix-run/node";
import type {
  TBaseDetailPage,
  TBaseListPage,
  TListPageItemAllMeta,
} from "~/common/types";

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
 * serverside functions
 */

export async function loader({ request }: LoaderArgs) {
  const category = new URL(request.url).searchParams.get("category");
  const catId = new URL(request.url).searchParams.get("id");
  //handle previews
  const previewResponse = await handlePreview<TLessonsPreview>(request);
  if (previewResponse.isPreview && previewResponse.data) {
    return json({ data: previewResponse.data });
  }
  //NOTE : deal with preview errrors here
  const pageUrl = `${BASE_API_URL}/pages/?type=lessons.LessonListPage&fields=ja_title,short_intro`;
  const categoriesUrl = `${BASE_API_URL}/lesson-categories/`;
  const lessonsUrl = category
    ? `${BASE_API_URL}/pages/?type=lessons.LessonDetailPage&category=${catId}&fields=*`
    : `${BASE_API_URL}/pages/?type=lessons.LessonDetailPage&fields=*`;

  const urls = [pageUrl, lessonsUrl, categoriesUrl];
  try {
    const [page, lessons, categories] = await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then((r) => r.json())
          .then((data) => ({ data, url }))
          .catch((error) => ({ error, url }))
      )
    );
    /*
    if (!response.ok) {
      throw new Error("Error", { cause: response.status });
    }
    */
    return json({
      data: {
        page,
        lessons,
        categories,
      },
    });
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
export default function LessonsPage() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlId = searchParams.get("id");
  const {
    data: { page, lessons, categories },
  } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="container">
        <h1 className="page-heading">{page.data.items[0].ja_title}</h1>
        <p className="l-short-intro">{page.data.items[0].short_intro}</p>
        <div className="l-cat">
          <div className="l-cat__links">
            <Link
              to="."
              className={`l-cat__link ${!urlId ? "l-cat__link--active" : ""}`}
            >
              All Lessons
            </Link>
            {categories.data.map((category) => (
              <Link
                to={`?category=${category.ja_name}&id=${category.id}`}
                className={`l-cat__link ${
                  Number(urlId) === Number(category.id)
                    ? "l-cat__link--active"
                    : ""
                }`}
                key={category.id}
              >
                {category.ja_name}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <section className="container l-list-wrapper">
        <ul className="l-list">
          {lessons.data.items.map((lesson) => {
            const pubDate = new Date(lesson.published_date);
            return (
              <Link to={lesson.meta.slug} key={lesson.id}>
                <li className="l-list-item">
                  <img
                    src={`${BASE_BACK_URL}${lesson.header_image.meta.download_url}`}
                    alt={lesson.header_image.title}
                    className="l-list-item__img"
                  />
                  <div className="l-list-item__details">
                    <h3>{lesson.ja_title}</h3>
                    <p>{lesson.short_intro}</p>
                    <span>{`${pubDate.getFullYear()}/${
                      pubDate.getMonth() + 1
                    }/${pubDate.getDate()}`}</span>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </section>
    </>
  );
}
