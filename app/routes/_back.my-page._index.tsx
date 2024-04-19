import { BASE_API_URL } from "~/common/constants.server";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

/**
 *  Actions and Loaders
 **/
type TBlogLesson = {
  id: number;
  meta: {
    type: string;
    slug: string;
  };
  display_title: string;
  published_date: string;
  date?: string;
};

export async function loader() {
  const blogslUrl = `${BASE_API_URL}/pages/?order=-published_date&limit=8&type=lessons.LessonDetailPage&fields=_,id,slug,display_title,published_date,type`;
  const response = await fetch(blogslUrl);
  const data = await response.json();
  if (!response.ok) {
    throw new Response("Oops that's a 404", { status: 404 });
  }
  const posts: TPosts = data.items.map((bl: TBlogLesson) => {
    const date = new Date(bl.published_date);
    const dateString = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
    bl.date = dateString;
    return bl;
  });

  return json({ posts });
}

/**
 * Page
 */
type TPost = {
  id: number;
  meta: {
    type: string;
    slug: string;
  };
  display_title: string;
  published_date: string;
  date: string;
};

type TPosts = TPost[];

export default function MyPageIndexRoute() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="mp-i-info">
        <h2>エクスリンガルからのお知らせ</h2>
        <div>
          {posts.map((post) => {
            return (
              <NewsItem
                key={post.id}
                title={post.display_title}
                pageType={post.meta.type}
                slug={post.meta.slug}
                date={post.date}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Components
 */
type TNewsItem = {
  date: string;
  title: string;
  pageType: string;
  slug: string;
};

function NewsItem({ date, title, pageType, slug }: TNewsItem) {
  const url =
    pageType === "lessons.LessonDetailPage" ? `/blog-lessons/${slug}` : "#";
  const type =
    pageType === "lessons.LessonDetailPage" ? "[ ブログレッスン更新 ]" : "";
  return (
    <Link to={url} className="mp-i-news-link">
      <div className="mp-i-news">
        <div className="mp-i-news__top">
          <p>{date}</p> <p>{type}</p>
        </div>
        <h2>{title}</h2>
      </div>
    </Link>
  );
}
