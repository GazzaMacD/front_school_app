import { redirect } from "@remix-run/node";

/*
 * No index page as of yet so redirect to home
 */
export function loader() {
  return redirect("/");
}
