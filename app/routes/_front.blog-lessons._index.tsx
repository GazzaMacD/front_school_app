import React from "react";
import { redirect, json } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { FaArrowRightLong } from "react-icons/fa6";

import { BASE_API_URL } from "~/common/constants.server";
import { handlePreview } from "~/common/utils.server";
import { getGlobalEnv } from "~/common/utils";
import { HeadingOne } from "~/components/headings";

/*types */
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
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
  const pageUrl = `${BASE_API_URL}/pages/?type=lessons.LessonListPage&fields=title,display_title,display_tagline`;
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

export default function BlogLessonsIndexPage() {
  const ENV = getGlobalEnv();
  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("category");
  const { page, categories: c, lessonsData } = useLoaderData<typeof loader>();
  const categories = [...[{ id: 0, name: "All", ja_name: "全レッスン" }], ...c];
  const lessons = lessonsData.items;

  return (
    <div className="container">
      <header className="g-header1">
        <HeadingOne
          enText={page.title}
          jpText={page.display_title}
          align="center"
          bkground="light"
          level="h1"
        />
        <p className="g-header1__tagline">{page.display_tagline}</p>
      </header>
      <div className="bl-cats-wrapper">
        <div className="bl-cats-inner">
          <div className="bl-cats-aside">カテゴリで絞り込む</div>
          <div className="bl-cats">
            {categories.map((category, i) => {
              if (i === 0) {
                return (
                  <Link
                    to="/blog-lessons"
                    className={`bl-cat ${
                      selectedCat == null ? "bl-cat--active" : ""
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
                    className={`bl-cat ${
                      selectedCat === category.ja_name ? "bl-cat--active" : ""
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
      <div className="bl-posts">
        {lessons.length
          ? lessons.map((lesson) => {
              const pubDate = new Date(lesson.published_date);
              return (
                <Link
                  to={lesson.meta.slug}
                  key={lesson.id}
                  className="bl-post-link"
                >
                  <article className="bl-post">
                    <div className="bl-post__img-wrapper">
                      <img
                        src={`${ENV.BASE_BACK_URL}${lesson.header_image.thumbnail.src}`}
                        alt={lesson.header_image.title}
                      />
                      <div className="bl-post__overlay">
                        <div className="bl-post__overlay-inner">
                          <p>Let's learn!</p>
                          <p>勉強しよう</p>
                          <FaArrowRightLong />
                        </div>
                      </div>
                    </div>
                    <div className="bl-post__details">
                      <p>
                        {`${pubDate.getFullYear()}.${
                          pubDate.getMonth() + 1
                        }.${pubDate.getDate()}`}{" "}
                        <span>[ {lesson.category.ja_name} ]</span>
                      </p>
                      <h2>{lesson.display_title}</h2>
                    </div>
                  </article>
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
}
