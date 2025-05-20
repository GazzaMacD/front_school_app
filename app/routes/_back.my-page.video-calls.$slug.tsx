import * as React from "react";
import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

/**
 * Types
 */
import { TVCallMatches, TVCall, TVCalls } from "~/common/types";

/**
 *  Helpers
 */

function getBreadCrumbText(slug: string) {
  return slug.split("-").join(" ");
}

export const handle = {
  breadcrumb: (m: TVCallMatches) => {
    return (
      <Link to={`/my-page/video-calls/${m.data.slug}`}>
        {getBreadCrumbText(m.data.slug)}
      </Link>
    );
  },
};

/**
 * Loaders and Actions
 */

export function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  return json({ slug });
}

export default function VideoCallsDetailRoute() {
  const { slug } = useLoaderData<typeof loader>();
  const matches = useMatches();

  // Get teacher video call data from slug
  const {
    data: { videoCallsData },
  } = matches[2];

  console.log(videoCallsData);
  const vc = videoCallsData.find(
    (videoCall: TVCall) => videoCall.slug === slug
  );

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
      <div className="vc-dp-video-call-wrapper">
        <h2>Video Call Error</h2>
        <p>Sorry there seems to be no video call available here</p>
      </div>
    );
  } else {
    // has roomURL
    return (
      <div className="vc-dp-video-call-wrapper">
        <whereby-embed class="vc-dp-video-call" room={roomUrl} />
      </div>
    );
  }
}
