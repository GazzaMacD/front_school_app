import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";

export function loader({ params }: LoaderArgs) {
  const { slug } = params;
  return json({ slug });
}

export default function SchedulesDetailRoute() {
  const { slug } = useLoaderData<typeof loader>();
  const matches = useMatches();
  let schedule = null;
  let jsx = (
    <div className="bkscd">
      <h2>Schedule Error.</h2>
      <p>Sorry there seems to be no schedule here.</p>
    </div>
  );
  const {
    data: { schedulesBySlug },
  } = matches[2];
  if (typeof slug === "string") {
    schedule = schedulesBySlug[slug];
    if (schedule) {
      jsx = (
        <div className="bkscd">
          <h2>
            {schedule.teacherName}'s {schedule.schoolName} Booking Schedule
          </h2>
          <iframe
            title={`${schedule.teacherName}'s ${schedule.schoolName} Booking Schedule`}
            className="bkscd__iframe"
            src={schedule.scheduleUrl}
          ></iframe>
        </div>
      );
    }
  }

  return jsx;
}
