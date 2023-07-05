import { redirect, json } from "@remix-run/node";
import { BASE_API_URL, BASE_BACK_URL } from "~/common/constants";
import { useLoaderData } from "@remix-run/react";
import { handlePreview } from "~/common/utils";
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
    <div>
      <img
        src={`${BASE_BACK_URL}${data.header_image.meta.download_url}`}
        alt={data.header_image.title}
      />
      <h1 className="heading">{data.jp_title}</h1>
      <p>{`${pubDate.getFullYear()}/${
        pubDate.getMonth() + 1
      }/${pubDate.getDate()}`}</p>
      <p>
        Category:<br></br>
        <Link to={`/lessons?category=${data.category.id}`}>
          {data.category.ja_name}
        </Link>
      </p>
    </div>
  );
}
