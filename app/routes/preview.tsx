import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { BASE_API_URL } from "~/common/constants";

export async function loader({ request }: LoaderArgs) {
  /* A resource route to deal with routing the preview requests
   * from the cms to the correct route with required
   * query params.
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
    const data = await response.json();
    const htmlUrl = new URL(data.meta.html_url);
    const path = htmlUrl.pathname;
    const redirectUrl = `${path}?draft=true&id=${data.id}`;
    return redirect(redirectUrl);
  } catch (error) {
    console.error("Error in preview loader");
    return redirect("/");
  }
}
