import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import courseStyles from "~/styles/courses.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: courseStyles },
];

/*
 * client side code
 */
export default function CoursesParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
