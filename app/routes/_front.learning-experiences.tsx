import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import lEStyles from "~/styles/learning-experiences.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: lEStyles },
];

/*
 * client side code
 */
export default function LearningExperiencesParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
