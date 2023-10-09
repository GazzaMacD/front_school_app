import {
  type LoaderArgs,
  type LinksFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";

import { authenticatedUser } from "../common/session.server";
import mySpaceStyles from "~/styles/my-space.css";
import { type TUser } from "~/common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: mySpaceStyles },
];

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

export default function BackParentRoute() {
  const { user } = useLoaderData<typeof loader>();
  console.log(user);
  return (
    <>
      <aside className="bkms-sidebar">
        <p>My Space</p>
        <p>Hello {user?.contact?.name ? user.contact.name : user.email}</p>
      </aside>
      <main className="bkms-main">
        <Outlet />
      </main>
    </>
  );
}
