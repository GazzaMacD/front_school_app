import React from "react";
import {
  json,
  type MetaFunction,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FaArrowRightLong } from "react-icons/fa6";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv, getTitle } from "~/common/utils";
import pageStyles from "~/styles/components/pages.css";
import { BLOG_LESSONS_LIMIT, BLOG_LESSONS_OFFSET } from "~/common/constants";
import { SlidingHeaderPage } from "~/components/pages";

type TBlogLesson = {
  id: number;
  meta: {
    slug: string;
  };
  title: string;
  header_image: {
    id: number;
    title: string;
    original: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
    medium: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
    thumbnail: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
    alt: string;
  };
  display_title: string;
  display_tagline: string;
  published_date: string;
  category: {
    id: number;
    name: string;
    ja_name: string;
    slug: string;
  };
};

type TBlogLessons = TBlogLesson[];

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

function deDuplicateLessons(lessons: TBlogLessons): TBlogLessons {
  const lessonTracker: { [key: string]: "exists" } = {};
  const deDuplicated = lessons.filter((lesson) => {
    if (lessonTracker.hasOwnProperty(String(lesson.id))) {
      return false;
    }
    lessonTracker[String(lesson.id)] = "exists";
    return true;
  });
  return deDuplicated;
}

/*
 * Loader and Action functions
 */

export async function loader({ request }: LoaderFunctionArgs) {
  const category = new URL(request.url).searchParams.get("category");
  const page = new URL(request.url).searchParams.get("page");

  // route for fetcher load more

  // route for normal page load
  const indexPageUrl = `${BASE_API_URL}/pages/?type=lessons.LessonListPage&fields=_,title,display_title`;
  const categoriesUrl = `${BASE_API_URL}/lesson-categories/`;
  const urls = [indexPageUrl, categoriesUrl];
  const [indexPage, categoriesData] = await Promise.all(
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
            error: null,
          };
        })
        .catch((error) => ({
          data: null,
          status: 500,
          ok: false,
          url,
          error,
        }))
    )
  );
  if (!indexPage.ok || !categoriesData.ok || !indexPage.data.items.length) {
    throw new Response("Oops that's 404", { status: 404 });
  }
  /* ===== get detail pages ===== */
  let detailUrl = `${BASE_API_URL}/pages/?order=-published_date&type=lessons.LessonDetailPage&fields=_,id,slug,display_title,display_tagline,published_date,title,header_image,category&limit=${BLOG_LESSONS_LIMIT}`;

  //categories
  const categories = [
    ...[{ id: 0, name: "All", ja_name: "全レッスン" }],
    ...categoriesData.data,
  ];
  const filtered = categories.filter((c) => c.ja_name === category);
  const selectedCategory = filtered.length ? filtered[0] : categories[0];
  detailUrl = filtered.length
    ? detailUrl + `&category=${selectedCategory.id}`
    : detailUrl;

  /* === pages === */
  // determine if page number is coming from load more on list page
  // If not then reset page number to 1
  const referer = request.headers.get("referer");
  const isFromListPage = Boolean(
    referer && new URL(referer).pathname.includes("blog-lessons")
  );
  const pageNumber =
    isFromListPage &&
    page &&
    !Number.isNaN(Number.parseInt(page)) &&
    Number.parseInt(page) > 1
      ? Number.parseInt(page)
      : 1;
  detailUrl =
    pageNumber > 1
      ? detailUrl + `&offset=${(pageNumber - 1) * BLOG_LESSONS_OFFSET}`
      : detailUrl;
  const res = await fetch(detailUrl);
  const lessonsData = await res.json();
  if (!res.ok) {
    throw new Response("Oops that's 404", { status: 404 });
  }

  return json({
    page: indexPage.data.items[0],
    categories,
    selectedCategory,
    lessonsData,
    pageNumber,
    limit: BLOG_LESSONS_LIMIT,
  });
}

/*
 * Page
 */

export default function BlogLessonsIndexPage() {
  const ENV = getGlobalEnv();
  //loader data
  const { page, categories, selectedCategory, lessonsData, pageNumber, limit } =
    useLoaderData<typeof loader>();
  // categories
  //lessons
  const initLessons = lessonsData.items;
  const [lessons, setLessons] = React.useState<TBlogLessons>(initLessons);
  const [currentCategory, setCurrentCategory] =
    React.useState(selectedCategory);
  const [loadMore, setLoadMore] = React.useState(false);
  const totalLessonCount = lessonsData.meta.total_count;
  const currentLessonCount = lessons.length;
  const totalPages = Math.ceil(totalLessonCount / limit);

  /* === Effects === */
  React.useEffect(() => {
    const previousPage = Number(sessionStorage.getItem("previous-page"));
    if (!previousPage) {
      sessionStorage.setItem("previous-page", String(pageNumber));
      return;
    }
    if (previousPage === pageNumber) return;
    setLessons((old) => deDuplicateLessons([...old, ...lessonsData.items]));
    sessionStorage.setItem("previous-page", String(pageNumber));
    setLoadMore(false);
  }, [loadMore, pageNumber, lessonsData.items]);

  React.useEffect(() => {
    if (currentCategory.id !== selectedCategory.id) {
      setCurrentCategory(() => selectedCategory);
      setLessons(() => lessonsData.items);
    }
  }, [
    selectedCategory.id,
    currentCategory.id,
    selectedCategory,
    lessonsData.items,
  ]);

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
                      currentCategory.id === 0 ? "bl-lp-cat--active" : ""
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
                      currentCategory.id === category.id
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
                      <Link
                        to={lesson.meta.slug}
                        className="bl-lp-post-link"
                        target="_blank"
                      >
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
          {pageNumber < totalPages ? (
            <>
              <p className="bl-lp-post__see-more-count">
                {totalLessonCount}投稿中{currentLessonCount}投稿を表示
              </p>
              <Link
                to={`/blog-lessons?page=${pageNumber + 1}${
                  currentCategory.id === 0
                    ? ""
                    : "&category=" + currentCategory.ja_name
                }`}
                onClick={() => setLoadMore(true)}
                preventScrollReset
                className="bl-lp-post__see-more-btn"
              >
                もっと見る
              </Link>
            </>
          ) : null}
        </div>
      </section>
    </SlidingHeaderPage>
  );
}
