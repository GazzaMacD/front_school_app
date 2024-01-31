import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import blStyles from "~/styles/blog-lessons.css";
import { Swoosh1 } from "~/components/swooshes";

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
      <Swoosh1 swooshColor="beige" backColor="cream" />
    </>
  );
}
