import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import {
  redirect,
  type LoaderFunctionArgs,
  type LinksFunction,
} from "@remix-run/node";

import {
  authenticatedUser,
  createAuthenticatedHeaders,
} from "~/common/session.server";
import { BASE_API_URL } from "~/common/constants.server";
import videoCallStyles from "~/styles/video-calls.css";
import type { TUser } from "~/common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: videoCallStyles },
];

export const handle = {
  breadcrumb: (m) => <Link to="/my-page/video-calls">ビデオ通話</Link>,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userData = await authenticatedUser(request);
  const redirectTo = new URL(request.url).pathname;
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
  //if null get path and redirect to login route with redirect parameter
  if (!userData) {
    throw redirect(`/login?${searchParams}`);
  }
  try {
    const headers = createAuthenticatedHeaders(userData);
    const videoCallsUrl = `${BASE_API_URL}/video-calls/`;
    const videoCallsRes = await fetch(videoCallsUrl, { headers });
    if (!videoCallsRes.ok) {
      throw redirect(`/login?${searchParams}`);
    }
    const videoCallsData = await videoCallsRes.json();
    return { videoCallsData };
  } catch (error) {
    console.log(`Oops error in  ${redirectTo}`);
    throw new Response("Ooops that is a 500", { status: 500 });
  }
}

export default function VideoCallsParentRoute() {
  const { videoCallsData } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const perms = matches[1].data.perms;
  if (!perms.classSchedules) {
    /* warn user they don't have access */
    return (
      <>
        <p>Sorry you don't have permission to see this part of the site.</p>
        <Link to="/my-space">Go back to my Page</Link>
      </>
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

/* types */
