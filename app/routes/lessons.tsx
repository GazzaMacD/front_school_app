import { redirect, json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { BASE_API_URL } from "~/common/constants";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  let apiUrl: string;
  const isDraft = url.searchParams.get("draft");
  const id = url.searchParams.get("id");
  if (isDraft && id) {
    //check that user has admin rights if not go to ususal page
    //if user has rights then get draft information
    //get the draft data
    apiUrl = `${BASE_API_URL}/pages/${id}/?draft=true`;
    try {
      const draftResponse = await fetch(apiUrl);
      const draftData = await draftResponse.json();
      return json({ data: draftData });
    } catch (error) {
      console.error("Error here");
    }
  } // end draft
  //usual route
  apiUrl = `${BASE_API_URL}/pages/?type=lessons.LessonListPage&fields=jp_title`;
  try {
    const response = await fetch(apiUrl);
    const pagesData = await response.json();
    const data = pagesData.items[0];
    return json({ data });
  } catch (error) {
    console.error("Error here");
  }
}

export default function Lessons() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="heading">{data.jp_title}</h1>
    </div>
  );
}
