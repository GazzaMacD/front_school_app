import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import lessonStyles from "../styles/lessons.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: lessonStyles },
];

/*
 * client side code
 */
export default function LessonsParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
