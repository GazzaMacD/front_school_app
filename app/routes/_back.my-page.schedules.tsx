import { useMatches, Link, useLoaderData, Outlet } from "@remix-run/react";
import {
  redirect,
  json,
  type LoaderFunctionArgs,
  type LinksFunction,
} from "@remix-run/node";

import {
  authenticatedUser,
  createAuthenticatedHeaders,
} from "~/common/session.server";
import { BASE_API_URL } from "~/common/constants.server";
import schedulesStyles from "~/styles/schedules.css";
import type { TUser } from "~/common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: schedulesStyles },
];

export const handle = {
  breadcrumb: (m) => <Link to="/my-page/schedules">スケジュール</Link>,
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
    const schedulesUrl = `${BASE_API_URL}/supersaas-schedules`;
    const schedulesRes = await fetch(schedulesUrl, { headers });
    if (!schedulesRes.ok) {
      throw redirect(`/login?${searchParams}`);
    }
    const data = await schedulesRes.json();
    const schedulesBySchool = createSchedulesBySchool(data);
    const schedulesBySlug = createSchedulesBySlug(data);
    return { schedulesBySchool, schedulesBySlug };
  } catch (error) {
    console.log(`Oops error in  ${redirectTo}`);
    throw new Response("Ooops that is a 500", { status: 500 });
  }
}

export default function SchedulesParentRoute() {
  const { schedulesBySchool, schedulesBySlug } = useLoaderData<typeof loader>();
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
    <>
      <p>Booking Schedules</p>
      <Outlet />
    </>
  );
}

/*
 * Schedules by ____ functions
 */
/* types */
type TScheduleItem = {
  slug: string;
  schedule_url: string;
  teacher: {
    name: string;
  };
  language_school: {
    name: string;
  };
};
type TScheduleData = TScheduleItem[];

interface IDictionary<T> {
  [Key: string]: T;
}

type TSchedulesBySchoolItem = {
  id: number;
  slug: string;
  teacherName: string;
  schoolName: string;
};
type TSchduleBySchoolData = IDictionary<TSchedulesBySchoolItem[]>;

type TSchedulesBySlugItem = TSchedulesBySchoolItem & {
  scheduleUrl: string;
};
type TSchdulesBySlugData = IDictionary<TSchedulesBySlugItem>;

/* functions */
function createSchedulesBySchool(data: TScheduleData): TSchduleBySchoolData {
  const scheduleBySchoolData: TSchduleBySchoolData = {};
  data.forEach((scheduleItem, i: number) => {
    const schoolName = scheduleItem.language_school.name;
    const schoolObj = {
      id: i,
      slug: scheduleItem.slug,
      teacherName: scheduleItem.teacher.name,
      schoolName: scheduleItem.language_school.name,
    };
    if (Object.hasOwn(scheduleBySchoolData, schoolName)) {
      scheduleBySchoolData[schoolName].push(schoolObj);
    } else {
      scheduleBySchoolData[schoolName] = [];
      scheduleBySchoolData[schoolName].push(schoolObj);
    }
  });
  return scheduleBySchoolData;
}

function createSchedulesBySlug(data: TScheduleData): TSchdulesBySlugData {
  const schedulesBySlug: TSchdulesBySlugData = {};
  data.forEach((scheduleObj, i) => {
    const slug = scheduleObj.slug;
    const scheduleBySlugObj = {
      id: i + 1,
      slug,
      teacherName: scheduleObj.teacher.name,
      schoolName: scheduleObj.language_school.name,
      scheduleUrl: scheduleObj.schedule_url,
    };
    schedulesBySlug[slug] = scheduleBySlugObj;
  });
  return schedulesBySlug;
}
