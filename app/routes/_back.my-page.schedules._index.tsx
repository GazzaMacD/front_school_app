import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import { BsCalendarWeek } from "react-icons/bs";

export default function SchedulesIndexRoute() {
  const matches = useMatches();
  const {
    data: { schedulesBySchool },
  } = matches[2];

  return (
    <div>
      <p>
        Please note that schedules for physical schools allow both online and
        face to face lessons if the time is open.
      </p>
      {Object.entries(schedulesBySchool).map(([schoolName, school]) => (
        <div key={schoolName} className="sc-lp-school__schedule">
          <h2>{schoolName}</h2>
          {school.map((scheduleObj) => (
            <Link
              key={scheduleObj.id}
              className="sc-lp-school__schedule__link"
              to={`${scheduleObj.slug}`}
            >
              <div>
                <BsCalendarWeek />
                <span>{scheduleObj.teacherName}'s Booking Schedule</span>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
