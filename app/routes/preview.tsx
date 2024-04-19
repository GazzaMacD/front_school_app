import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { BASE_API_URL } from "~/common/constants.server";

export async function loader({ request }: LoaderFunctionArgs) {
  /* A resource route to deal with routing the preview requests
   * from the cms to the correct route with required
   * query params. This current structue necessitates
   * that the backend cms page structure mirrors the front end
   */
  const url = new URL(request.url);
  const content_type = url.searchParams.get("content_type");
  const token = url.searchParams.get("token");
  if (!content_type || !token) {
    return redirect("/");
  }
  const apiUrl = `${BASE_API_URL}/page-preview/?content_type=${encodeURIComponent(
    content_type
  )}&token=${encodeURIComponent(token)}&format=json`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `Error in preview loader. Status code: ${response.status}`
      );
    }
    const data = await response.json();
    if (!data?.meta || !data?.meta?.html_url) {
      throw new Error("Data error on preview routing page.");
    }
    const htmlUrl = new URL(data.meta.html_url);
    const path = htmlUrl.pathname;
    const redirectUrl = `${path}?draft=true&id=${data.id}`;
    return redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    // Log error and simply redirectt to homepage.
    return redirect("/");
  }
}
