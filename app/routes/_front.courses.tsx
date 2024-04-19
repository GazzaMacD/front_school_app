import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import courseStyles from "~/styles/courses.css";
import cardStyles from "~/styles/components/cards.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: courseStyles },
  { rel: "stylesheet", href: cardStyles },
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
