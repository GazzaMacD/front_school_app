import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import { BsPersonVideo2 } from "react-icons/bs";
import { SolidPillButtonLink } from "~/components/buttons";

export default function VideoCallsIndexRoute() {
  const matches = useMatches();
  console.log(matches);
  const {
    data: { videoCallsData },
  } = matches[2];
  console.log(videoCallsData);

  return (
    <div className="vc-lp-list-wrapper">
      {videoCallsData.map((videoCallObj: TVideoCallObj) => {
        return (
          <SolidPillButtonLink
            color="green"
            key={videoCallObj.teacher.id}
            to={`/my-page/video-calls/${videoCallObj.slug}`}
          >
            <BsPersonVideo2 />
            &nbsp;&nbsp; {videoCallObj.teacher.name}
          </SolidPillButtonLink>
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
