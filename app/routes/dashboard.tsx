import { type LoaderArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticatedUser } from "../common/session.server";
import { type TUser } from "~/common/types";

// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: dasboardParentStyles },
// ];

export async function loader({ request }: LoaderArgs) {
  const userData = await authenticatedUser(request);
  //if null get path and redirect to login route with redirect parameter
  if (!userData) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  const user: TUser = userData.user;
  return json({ user });
}

export default function DashboardParentRoute() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="heading">Dashboard</h1>
      <p>Hello {user.full_name ? user.full_name : user.email}</p>
    </div>
  );
}
