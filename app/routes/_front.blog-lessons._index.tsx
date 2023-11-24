import React from "react";
import { redirect, json } from "@remix-run/node";
import { BASE_API_URL } from "~/common/constants.server";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { handlePreview } from "~/common/utils.server";
import { getGlobalEnv } from "~/common/utils";
import { useSearchParams } from "@remix-run/react";

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
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const category = JSON.parse(formData.get("selectedCat") as string);
  const currentOffset = formData.get("currentOffset") as string;
  const currentLimit = formData.get("currentLimit") as string;
  let lessonsUrl = category.id
    ? `${BASE_API_URL}/pages/?order=-published_date&type=lessons.LessonDetailPage&category=${
        category.id
      }&fields=*&limit=${currentLimit}&offset=${Number(currentOffset)}`
    : `${BASE_API_URL}/pages/?order=-published_date&type=lessons.LessonDetailPage&fields=*&limit=${currentLimit}&offset=${Number(
        currentOffset
      )}`;
  try {
    const res = await fetch(lessonsUrl);
    const data = await res.json();
    if (!res.ok || !data.items.length) {
      return json({
        items: [],
        error: true,
        totalCount: 0,
      });
    }
    return json({
      items: data.items,
      error: false,
      totalCount: data.meta.total_count,
    });
  } catch (error) {
    return json({
      items: [],
      error: true,
      totalCount: 0,
    });
  }
};

export async function loader({ request }: LoaderArgs) {
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
    let detailUrl = `${BASE_API_URL}/pages/?order=-published_date&type=lessons.LessonDetailPage&fields=_,slug,display_title,display_tagline,published_date,title,header_image`;
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
  const { page, categories: c, lessonsData } = useLoaderData<typeof loader>();
  const categories = [...[{ id: 0, name: "All", ja_name: "全レッスン" }], ...c];

  // States
  const [selectedCat, setSelectedCat] = React.useState<{
    id: null | number;
    jaCat: null | string;
  }>({ id: 0, jaCat: null });
  const lessons = lessonsData.items;

  return (
    <div>
      <header className="container">
        <hgroup className="heading1">
          <h1>
            <span>{page.title}</span>
            {page.display_title}
          </h1>
          <p>{page.display_tagline}</p>
        </hgroup>
        <p className="l-short-intro">{page.short_intro}</p>
        <div className="l-cat">
          <div className="l-cat__links">
            {categories.map((category) => (
              <button
                className={`l-cat__link ${
                  Number(selectedCat.id) === Number(category.id)
                    ? "l-cat__link--active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCat({
                    id: Number(category.id),
                    jaCat: category.ja_name,
                  });
                }}
                key={category.id}
              >
                {category.ja_name}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="container l-list-wrapper">
        {lessons.length ? (
          <div className="l-list">
            {lessons.map((lesson) => {
              const pubDate = new Date(lesson.published_date);
              return (
                <Link
                  to={lesson.meta.slug}
                  key={lesson.id}
                  className="l-list-link"
                >
                  <div className="l-list-item">
                    <div className="l-list-item__img">
                      <img
                        src={`${ENV.BASE_BACK_URL}${lesson.header_image.thumbnail.src}`}
                        alt={lesson.header_image.title}
                      />
                    </div>
                    <div className="l-list-item__details">
                      <h4>{lesson.display_title}</h4>
                      <p>{lesson.display_tagline}</p>
                      <span>{`${pubDate.getFullYear()}/${
                        pubDate.getMonth() + 1
                      }/${pubDate.getDate()}`}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/*
 * olde  code 
      <div className="container">
        {/* {lessons.length && (
        <ul className="l-list">
          {lessons.map((lesson) => {
            const pubDate = new Date(lesson.published_date);
            return (
              <Link to={lesson.meta.slug} key={lesson.id}>
                <li className="l-list-item">
                  <img
                    src={`${ENV.BASE_BACK_URL}${lesson.header_image.meta.download_url}`}
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
        )} }
        <button>Load More</button>
    </div>
  );
}

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
  let lessonsUrl = category
    ? `${BASE_API_URL}/pages/?order=-published_date&type=lessons.LessonDetailPage&category=${catId}&fields=*&limit=1`
    : `${BASE_API_URL}/pages/?order=-published_date&type=lessons.LessonDetailPage&fields=*&limit=1`;
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
    // NOTE TO SELF ****** NEED ERROR HANDLING
    return json({
      page: page.data.items[0],
      lessonsData: {
        items: lessons.data.items,
        error: false,
        totalCount: lessons.data.meta.total_count,
      },
      categories: categories.data,
    });
  } catch (error) {
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
export default function LessonsPage() {
  const [searchParams] = useSearchParams();
  const paramCat = searchParams.get("category");
  const paramId = searchParams.get("id");
  const fetcher = useFetcher();
  const ENV = getGlobalEnv();
  const { page, lessonsData, categories } = useLoaderData<typeof loader>();
  console.log("LessonData Outside", lessonsData);
  const limit = 1;

  // States
  const [selectedCat, setSelectedCat] = React.useState<{
    id: null | number;
    jaCat: null | string;
  }>(() => {
    return paramCat && paramId
      ? { id: Number(paramId), jaCat: paramCat }
      : { id: null, jaCat: null };
  });
  const [offSet, setOffSet] = React.useState(0);
  const [catChanged, setCatChanged] = React.useState(false);
  const [lessons, setLessons] = React.useState(lessonsData.items);
  const [totalLessons, setTotalLessons] = React.useState(
    lessonsData.totalCount
  );
  const [numLessons, setNumLessons] = React.useState(lessonsData.items.length);

  // Effects
  React.useEffect(() => {
    if (!catChanged) return;
    setLessons(lessonsData.items);
    console.log("fetcher.data", fetcher.data);
    console.log("LessonData", lessonsData);
    setTotalLessons(lessonsData.totalCount);
    setCatChanged(false);
  }, [lessonsData.items, catChanged]);

  React.useEffect(() => {
    if (fetcher.data && fetcher.data.items.length) {
      setLessons((currentLessons) => [
        ...currentLessons,
        ...fetcher.data.items,
      ]);
    }
  }, [fetcher.data]);

  React.useEffect(() => {
    setNumLessons(lessons.length);
  }, [lessons]);

  return (
    <>
      <header className="container">
        <h1 className="page-heading">{page.ja_title}</h1>
        <p className="l-short-intro">{page.short_intro}</p>
        <div className="l-cat">
          <div className="l-cat__links">
            <Link
              to="/lessons"
              onClick={() => {
                setSelectedCat({
                  id: null,
                  jaCat: null,
                });
                setCatChanged(true);
              }}
              className={`l-cat__link ${
                !selectedCat.id ? "l-cat__link--active" : ""
              }`}
            >
              All Lessons
            </Link>
            {categories.map((category) => (
              <Link
                to={`?category=${category.ja_name}&id=${category.id}`}
                className={`l-cat__link ${
                  Number(selectedCat.id) === Number(category.id)
                    ? "l-cat__link--active"
                    : ""
                }`}
                onClick={() => {
                  setCatChanged(true);
                  setSelectedCat({
                    id: Number(category.id),
                    jaCat: category.ja_name,
                  });
                }}
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
          {lessons.map((lesson) => {
            const pubDate = new Date(lesson.published_date);
            return (
              <Link to={lesson.meta.slug} key={lesson.id}>
                <li className="l-list-item">
                  <img
                    src={`${ENV.BASE_BACK_URL}${lesson.header_image.meta.download_url}`}
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
        {numLessons < totalLessons ? (
          <fetcher.Form method="post">
            <input
              type="hidden"
              name="selectedCat"
              value={JSON.stringify(selectedCat)}
            />
            <input type="hidden" name="currentOffset" value={String(offSet)} />
            <input type="hidden" name="currentLimit" value={String(limit)} />
            <button
              onClick={() => setOffSet((old) => old + limit)}
              type="submit"
            >
              Load More
            </button>
          </fetcher.Form>
        ) : null}
      </section>
    </>
  );
}

 */
