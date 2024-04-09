import React from "react";
import { json, type MetaFunction, type LinksFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { FaArrowRightLong } from "react-icons/fa6";

import { getTitle } from "~/common/utils";
import { BASE_API_URL } from "~/common/constants.server";
import { handlePreview } from "~/common/utils.server";
import { getGlobalEnv } from "~/common/utils";
import { HeadingOne } from "~/components/headings";
import { Swoosh1 } from "~/components/swooshes";
import pageStyles from "~/styles/components/pages.css";

/*types */
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type {
  TBaseDetailPage,
  TBaseListPage,
  TListPageItemAllMeta,
} from "~/common/types";
import { SlidingHeaderPage } from "~/components/pages";

type TLessonsPreview = TBaseDetailPage & {
  jp_title: string;
};

type TLesson = TListPageItemAllMeta & {
  jp_title: string;
};

type TLessons = TBaseListPage & {
  items: TLesson[];
};

/**
 * Helper functions
 */
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageStyles },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: getTitle({
        title: "Blog Lessons・読んで学べるブログ",
        isHome: false,
      }),
    },
  ];
};

/*
 * Loader and Action functions
 */

export async function loader({ request }: LoaderFunctionArgs) {
  const category = new URL(request.url).searchParams.get("category");
  const pageUrl = `${BASE_API_URL}/pages/?type=lessons.LessonListPage&fields=_,title,display_title`;
  const categoriesUrl = `${BASE_API_URL}/lesson-categories/`;
  const urls = [pageUrl, categoriesUrl];
  try {
    const [page, categories] = await Promise.all(
      urls.map((url) =>
        fetch(url)
          .then(async (r) => {
            return {
              data: await r.json(),
              status: r.status,
              ok: r.ok,
            };
          })
          .then((data) => {
            return {
              data: data.data,
              status: data.status,
              ok: data.ok,
              url: url,
            };
          })
          .catch((error) => ({ error, url }))
      )
    );
    if (!page.ok || !categories.ok || !page.data.items.length) {
      throw new Response("Oops that's 404", { status: 404 });
    }
    // can now get detail page
    let detailUrl = `${BASE_API_URL}/pages/?order=-published_date&type=lessons.LessonDetailPage&fields=_,id,slug,display_title,display_tagline,published_date,title,header_image,category`;
    if (category) {
      const filtered = categories.data.filter((c) => c.ja_name === category);
      const target = filtered.length ? filtered[0] : null;
      detailUrl = target ? detailUrl + `&category=${target.id}` : detailUrl;
    }
    const res = await fetch(detailUrl);
    const data = await res.json();
    if (!res.ok) {
      throw new Response("Oops that's 404", { status: 404 });
    }

    return json({
      page: page.data.items[0],
      categories: categories.data,
      lessonsData: data,
    });
  } catch (error) {
    throw new Response("Oops sorry something went wrong", {
      status: 500,
    });
  }
}

/*
 * Page
 */

export default function BlogLessonsIndexPage() {
  const ENV = getGlobalEnv();
  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("category");
  const { page, categories: c, lessonsData } = useLoaderData<typeof loader>();
  const categories = [...[{ id: 0, name: "All", ja_name: "全レッスン" }], ...c];
  const lessons = lessonsData.items;

  return (
    <SlidingHeaderPage
      mainTitle={page.title}
      subTitle={page.display_title}
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <div className="bl-lp-cats-wrapper">
        <div className="bl-lp-cats-wrapper__inner">
          <div className="bl-lp-cats-aside">カテゴリで絞り込む</div>
          <div className="bl-lp-cats">
            {categories.map((category, i) => {
              if (i === 0) {
                return (
                  <Link
                    to="/blog-lessons"
                    className={`bl-lp-cat ${
                      selectedCat == null ? "bl-lp-cat--active" : ""
                    }`}
                    key={category.id}
                  >
                    {category.ja_name}
                  </Link>
                );
              } else {
                return (
                  <Link
                    to={`/blog-lessons?category=${category.ja_name}`}
                    key={category.id}
                    className={`bl-lp-cat ${
                      selectedCat === category.ja_name
                        ? "bl-lp-cat--active"
                        : ""
                    }`}
                  >
                    {category.ja_name}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>

      <section id="posts">
        <div className="bl-lp-posts">
          <div className="g-grid-container1">
            {lessons.length
              ? lessons.map((lesson, i) => {
                  const pubDate = new Date(lesson.published_date);
                  const n = i % 2;
                  return (
                    <div key={lesson.id} className={`bl-lp-post-wrapper t${n}`}>
                      <Link to={lesson.meta.slug} className="bl-lp-post-link">
                        <article className="bl-lp-post">
                          <div className="bl-lp-post__img-wrapper">
                            <img
                              src={`${ENV.BASE_BACK_URL}${lesson.header_image.thumbnail.src}`}
                              alt={lesson.header_image.title}
                            />
                            <div className="bl-lp-post__overlay">
                              <p>Let's learn!</p>
                              <p>勉強しよう</p>
                              <FaArrowRightLong />
                            </div>
                          </div>
                          <div className="bl-lp-post__details">
                            <p>
                              {`${pubDate.getFullYear()}.${
                                pubDate.getMonth() + 1
                              }.${pubDate.getDate()}`}{" "}
                              <span>[ {lesson.category.ja_name} ]</span>
                            </p>
                            <h3>{lesson.display_title}</h3>
                          </div>
                        </article>
                      </Link>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </section>
    </SlidingHeaderPage>
  );
}
