import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import { BsCalendarWeek } from "react-icons/bs";

export default function VideoCallsIndexRoute() {
  const matches = useMatches();
  console.log(matches);
  const {
    data: { videoCallsData },
  } = matches[2];
  console.log(videoCallsData);

  return (
    <div>
      <p>Video Calls</p>
      {videoCallsData.map((videoCallObj: TVideoCallObj) => {
        return (
          <Link
            key={videoCallObj.teacher.id}
            to={`/my-page/video-calls/${videoCallObj.slug}`}
          >
            {videoCallObj.teacher.name}
          </Link>
        );
      })}
    </div>
  );
}

type TVideoCallObj = {
  slug: string;
  teacher: {
    name: string;
    id: number;
  };
};
