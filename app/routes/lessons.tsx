import { redirect, json } from "@remix-run/node";
import { BASE_API_URL } from "~/common/constants";
import { useLoaderData } from "@remix-run/react";
import { handlePreview } from "~/common/utils";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";

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
  //handle previews
  const previewResponse = await handlePreview<TLessonsPreview>(request);
  if (previewResponse.isPreview && previewResponse.data) {
    return json({ data: previewResponse.data });
  }
  //NOTE : deal with preview errrors here
  const apiUrl = `${BASE_API_URL}/pages/?type=lessons.LessonListPage&fields=jp_title`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error", { cause: response.status });
    }
    const pagesData: TLessons = await response.json();
    const data: TLesson = pagesData.items[0];
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
export default function Lessons() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="heading">{data.jp_title}</h1>
    </div>
  );
}
