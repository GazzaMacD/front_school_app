import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";

export default function SchedulesIndexRoute() {
  const matches = useMatches();
  const {
    data: { schedulesBySchool },
  } = matches[2];

  return (
    <div>
      {Object.entries(schedulesBySchool).map(([schoolName, school]) => (
        <div key={schoolName}>
          <h2>{schoolName}</h2>
          {school.map((scheduleObj) => (
            <Link key={scheduleObj.id} to={`${scheduleObj.slug}`}>
              <div>{scheduleObj.teacherName}'s Booking Schedule</div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
