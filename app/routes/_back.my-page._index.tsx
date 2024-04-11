import { BASE_API_URL } from "~/common/constants.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const blogslUrl = `${BASE_API_URL}/pages/?order=-published_date&limit=8&type=lessons.LessonDetailPage&fields=_,id,slug,display_title,published_date`;
  const response = await fetch(blogslUrl);
  const data = await response.json();
  if (!response.ok) {
    throw new Response("Oops that's a 404", { status: 404 });
  }
  const posts = data.items;
  return json({ posts });
}

export default function MyPageIndexRoute() {
  const { posts } = useLoaderData<typeof loader>();
  console.log(posts);
  return (
    <div>
      <div className="mp-p-breadcrumbs">breadcrumbs here</div>
      <div className="mp-i-info">
        <h2>エクスリンガルからのお知らせ</h2>
      </div>
    </div>
  );
}
