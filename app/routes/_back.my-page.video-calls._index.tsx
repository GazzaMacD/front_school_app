import { useMatches } from "@remix-run/react";
import { BsPersonVideo2 } from "react-icons/bs";
import { SolidPillButtonLink } from "~/components/buttons";

import { TVCalls, TVCall } from "~/common/types";

export default function VideoCallsIndexRoute() {
  const matches = useMatches();
  const { data } = matches[2];
  const { videoCallsData }: TVCalls = data;

  return (
    <div className="vc-lp-list-wrapper">
      {videoCallsData.map((videoCallObj: TVCall) => {
        return (
          <SolidPillButtonLink
            color="green"
            key={videoCallObj.teacher.id}
            to={`/my-page/video-calls/${videoCallObj.slug}`}
            reloadDoc={true}
          >
            <div className="vc-lp-button__inner">
              <BsPersonVideo2 />
              {videoCallObj.teacher.name}
            </div>
          </SolidPillButtonLink>
        );
      })}
    </div>
  );
}
