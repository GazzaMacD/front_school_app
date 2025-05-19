import * as React from "react";
import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

function getBreadCrumbText(slug) {
  return slug.split("-").join(" ");
}

export function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  return json({ slug });
}
export const handle = {
  breadcrumb: (m) => (
    <Link to={`/my-page/video-calls/${m.data.slug}`}>
      {getBreadCrumbText(m.data.slug)}
    </Link>
  ),
};

export default function VideoCallsDetailRoute() {
  const { slug } = useLoaderData<typeof loader>();
  const matches = useMatches();

  // Get teacher video call data from slug
  const {
    data: { videoCallsData },
  } = matches[2];
  const vc = videoCallsData.find((videoCall) => videoCall.slug === slug);

  // Verify if host or guest
  let roomUrl;

  const {
    data: { user },
  } = matches[1];
  if (user.is_staff && vc && vc.teacher.id === user.id) {
    roomUrl = vc.host_room_url;
  } else {
    roomUrl = vc.room_url;
  }

  // Verify if host or guest
  if (!vc || !roomUrl || typeof roomUrl !== "string") {
    // Something wrong here so show user
    return (
      <div className="">
        <h2>Video Call Error</h2>
        <p>Sorry there seems to be no video call available here</p>
      </div>
    );
  } else {
    // has roomURL
    return (
      <div>
        <whereby-embed
          room={roomUrl}
          style={{ width: "100%", height: "70vh" }}
        />
      </div>
    );
  }
}
