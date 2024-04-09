import {
  type LoaderFunctionArgs,
  type LinksFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Outlet, Link } from "@remix-run/react";

import { authenticatedUser } from "../common/session.server";
import { hasSchedulePermissions } from "../common/permissions.server";
import mySpaceStyles from "~/styles/my-space.css";
import { type TUser } from "~/common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: mySpaceStyles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userData = await authenticatedUser(request);
  //if null get path and redirect to login route with redirect parameter
  if (!userData) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  const user: TUser = userData.user;
  const perms = {
    classSchedules: hasSchedulePermissions(user.groups, user.is_staff),
  };
  return json({ user, perms });
}

export default function BackParentRoute() {
  const { user, perms } = useLoaderData<typeof loader>();

  return (
    <>
      <aside className="bkms-sidebar">
        <p>My Space</p>
        <p>Hello {user?.contact?.name ? user.contact.name : user.email}</p>
        {perms.classSchedules && (
          <Link to="/my-space/schedules">Book class</Link>
        )}
      </aside>
      <main className="bkms-main">
        <Outlet />
      </main>
    </>
  );
}
