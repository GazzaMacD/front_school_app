import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import blStyles from "~/styles/blog-lessons.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: blStyles },
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
