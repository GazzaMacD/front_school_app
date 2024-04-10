import {
  type LoaderFunctionArgs,
  type LinksFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Outlet, Link } from "@remix-run/react";

import { authenticatedUser } from "../common/session.server";
import { hasSchedulePermissions } from "../common/permissions.server";
import myPageStyles from "~/styles/my-page.css";
import { type TUser } from "~/common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: myPageStyles },
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

export default function MyPageParentRoute() {
  const { user, perms } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="mp-p-header">
        <h2>マイページ</h2>
        <p>
          <span>こんにちは、</span>
          <span>{user?.contact?.name ? user.contact.name : user.email}</span>
        </p>
      </header>
      <aside className="mp-p-sidebar">
        {perms.classSchedules && (
          <Link to="/my-space/schedules">Book class</Link>
        )}
      </aside>
      <main className="mp-p-main">
        <Outlet />
      </main>
    </>
  );
}
