import { useMatches, Link } from "@remix-run/react";

export default function SchedulesParentRoute() {
  const matches = useMatches();
  const perms = matches[1].data.perms;
  if (!perms.classSchedules) {
    return (
      <>
        <p>Sorry you don't have permission to see this page</p>
        <Link to="/my-space">Go back to my Page</Link>
      </>
    );
  }

  return (
    <>
      <p>Schedules</p>
    </>
  );
}
